
{
  description = "Development environment with package list";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    solc = {
      url = "github:ryardley/solc.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, flake-utils, solc }:
    flake-utils.lib.eachDefaultSystem (system:
      let 
        pkgs = import nixpkgs {
          inherit system;
          overlays = [
            solc.overlay
          ];
        };
      in 
      with pkgs;
      {
        devShells.default = mkShell {
          # package list
          buildInputs = [ 
            circom
            solc_0_8_24
            (solc.mkDefault pkgs solc_0_8_24)
          ];
        };
      }    
    );
}
