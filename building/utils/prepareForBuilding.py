from os import path, mkdir, unlink
from shutil import rmtree


def prepareForBuilding(pathToDesDirForResults, pathToTempDirForExtension, nameOfExtensionFile):
  if path.exists(pathToDesDirForResults) == False:
    mkdir(pathToDesDirForResults)

  if path.exists(pathToTempDirForExtension):
    rmtree(pathToTempDirForExtension)
  mkdir(pathToTempDirForExtension)

  fullNameOfFile = pathToDesDirForResults + "/" + nameOfExtensionFile + ".firefox.xpi"
  if path.exists(fullNameOfFile):
    unlink(fullNameOfFile)

  fullNameOfFile = pathToDesDirForResults + "/" + nameOfExtensionFile + ".chromium.zip"
  if path.exists(fullNameOfFile):
    unlink(fullNameOfFile)
