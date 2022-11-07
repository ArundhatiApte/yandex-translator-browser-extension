from os import path, mkdir, unlink
from shutil import rmtree


def prepareForBuilding(pathToTempDirForExtension, pathToDesDirForResults, nameOfExtensionFile):
  if path.exists(pathToTempDirForExtension):
    rmtree(pathToTempDirForExtension)
  mkdir(pathToTempDirForExtension)

  fullNameOfFile = pathToDesDirForResults + "/" + nameOfExtensionFile + ".firefox.xpi"
  if path.exists(fullNameOfFile):
    unlink(fullNameOfFile)

  fullNameOfFile = pathToDesDirForResults + "/" + nameOfExtensionFile + ".chromium.zip"
  if path.exists(fullNameOfFile):
    unlink(fullNameOfFile)
