import { HardhatUserConfig, subtask } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-ignition";

import {TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD} from "hardhat/builtin-tasks/task-names";

subtask(
  TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD,
  async (
    args: {
      solcVersion: string;
    },
    _,
    runSuper
  ) => {
    if (args.solcVersion === "0.8.24") {
      const compilerPath = "solc";

      return {
        compilerPath,
        isSolcJs: false, // if you are using a native compiler, set this to false
        version: args.solcVersion,
      };
    }

    // since we only want to override the compiler for version 0.8.24,
    // the runSuper function allows us to call the default subtask.
    return runSuper();
  }
);

const config: HardhatUserConfig = {
  solidity: "0.8.24",
};

export default config;
