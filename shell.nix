{ nixpkgs ? import (fetchTarball("channel:nixos-23.11")) {} }:
let
  inherit (nixpkgs) pkgs;
in pkgs.mkShell {
  nativeBuildInputs = with pkgs; [jq nodejs_20 swc nodePackages.typescript-language-server];
}
