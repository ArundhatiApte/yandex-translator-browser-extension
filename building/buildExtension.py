import sys

from utils.Configuration import Configuration
from utils.TypesOfBrowser import TypesOfBrowser
from utils.prepareForBuilding import prepareForBuilding;
from utils.buildExtension import buildExtension;


def main(args):
  if len(args) != 4:
    logAndExit(
      "Usage: <mode> <will-minify-code>\n",
      "  mode: prod|test\n",
      "  will-minify-code: 0|1\n",
      "  browser: firefox|chromium"
    )

  param = args[1]
  if (param == "test"):
    configuration = Configuration.TEST
  elif (param == "prod"):
    configuration = Configuration.PRODUCTION
  else:
    logAndExit("mode: prod|test")

  param = args[2]
  if param == "0":
    willMinifyCode = False
  elif param == "1":
    willMinifyCode = True
  else:
    logAndExit("will-minify-code: 0|1");

  param = args[3]
  if (param == "firefox"):
    typeOfBrowser = TypesOfBrowser.FIREFOX
  elif (param == "chromium"):
    typeOfBrowser = TypesOfBrowser.CHROMIUM

  nameOfExtensionFile = "extension"
  pathToSrcDir = "../src/main"
  pathToDesDirForResults = "./result"
  pathToTempDirForExtension = "./result/extension"

  prepareForBuilding(pathToDesDirForResults, pathToTempDirForExtension, nameOfExtensionFile)
  buildExtension(
    pathToSrcDir,
    pathToTempDirForExtension,
    pathToDesDirForResults,
    configuration,
    willMinifyCode,
    typeOfBrowser,
    nameOfExtensionFile
  )


def logAndExit(*messages):
  print(*messages)
  exit(-1)


if __name__ == "__main__":
  main(sys.argv);
