
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
        circom-lsp = pkgs.rustPlatform.buildRustPackage rec {
          pname = "circom-lsp";
          version = "0.1.3";  # Specify the correct version

          src = pkgs.fetchFromGitHub {
            owner = "rubydusa";  # Specify the owner
            repo = pname;
            rev = "v${version}";
            sha256 = "sha256-Y71qmeDUh6MwSlFrSnG+Nr/un5szTUo27+J/HphGr7M=";  # Provide the correct hash
          };

          cargoSha256 = "sha256-Lq8SpzkUqYgayQTApNngOlhceAQAPG9Rwg1pmGvyxnM=";  # Provide the correct cargo hash
          sourceRoot = "source/server";
          doCheck = false;
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
            circom-lsp
          ];
        };
      }    
    );
}
