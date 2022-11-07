import os
from os import path
import shutil
import subprocess
import sys

from utils.Configuration import Configuration
from utils.TypesOfBrowser import TypesOfBrowser


def buildExtension(
  pathToSrcDir,
  pathToTempDirForExtension,
  pathToDesDirForResults,
  configuration,
  willMinifyCode,
  typeOfBrowser,
  nameOfExtensionFile
):
  addManifest(pathToSrcDir, pathToTempDirForExtension, willMinifyCode, typeOfBrowser)
  addLocales(pathToSrcDir, pathToTempDirForExtension, ["en", "ru"], willMinifyCode)

  pathToWebpackConfig = createPath(path.dirname(path.abspath(__file__)), "configForWebpack.cjs")
  addJsFiles(pathToSrcDir, pathToTempDirForExtension, pathToWebpackConfig, configuration, willMinifyCode)

  addBackgroundScript(pathToSrcDir, pathToTempDirForExtension)
  addContentScripts(pathToSrcDir, pathToTempDirForExtension)
  addSettingsPage(pathToSrcDir, pathToTempDirForExtension, willMinifyCode)
  addPopupPage(pathToSrcDir, pathToTempDirForExtension, willMinifyCode)
  createExtensionFile(pathToTempDirForExtension, pathToDesDirForResults, nameOfExtensionFile, typeOfBrowser)


def createPath(*parts):
  return path.join(*parts)


def makeDir(path):
  os.mkdir(path)


def copyFile(srcPath, desPath):
  shutil.copyfile(srcPath, desPath)


def removeFile(path):
  os.unlink(path)


def copyTree(srcPath, desPath):
  shutil.copytree(srcPath, desPath)


def moveFile(srcPath, desPath):
  shutil.move(srcPath, desPath)


def addManifest(pathToSrcDir, pathToDesDir, willMinifyCode, typeOfBrowser):
  name = "firefox.json" if typeOfBrowser == TypesOfBrowser.FIREFOX else "chromium.json"
  pathToSrcFile = pathToSrcDir + "/manifest/" + name
  pathToDesFile = pathToDesDir + "/manifest.json"
  copyFile(pathToSrcFile, pathToDesFile);
  if willMinifyCode:
    minifyJsonFileInPlace(pathToDesFile)


def minifyJsonFileInPlace(path):
  params = ["npx", "minify-json", path]
  executeInShell(params)


def executeInShell(params):
  subprocess.run(params, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True, check=True)


def addLocales(pathToSrcDir, pathToDesDir, codesOfSupportedLanguages, willMinifyCode):
  pathToSrcLocalesDir = pathToSrcDir + "/_locales"
  pathToDesLocalesDir = pathToDesDir + "/_locales"
  makeDir(pathToDesLocalesDir)

  for code in codesOfSupportedLanguages:
    addLocale(pathToSrcLocalesDir, code, pathToDesLocalesDir, willMinifyCode)


def addLocale(pathToSrcLocalesDir, codeOfLanguage, pathToDesLocalesDir, willMinifyCode):
  pathToDesLocaleDir = pathToDesLocalesDir + "/" + codeOfLanguage
  makeDir(pathToDesLocaleDir)
  pathToDesMessagesFile = pathToDesLocaleDir + "/messages.json"
  copyFile(pathToSrcLocalesDir + "/" + codeOfLanguage + "/messages.json", pathToDesMessagesFile)
  if willMinifyCode:
    minifyJsonFileInPlace(pathToDesMessagesFile)


def addJsFiles(pathToSrcDir, pathToDesDir, pathToConfigForWebpack, configuration, willMinifyCode):
  nameOfConfigFileForTranslatorService = "forTests.js" if configuration == configuration.TEST else "forProduction.js"
  pathToSrcConfigForTranslatorService = pathToSrcDir + "/common/js/data/translationService/" + nameOfConfigFileForTranslatorService
  pathToDesTempConfig = pathToSrcDir + "/common/js/data/translationService/usedForBuild.js"
  copyFile(pathToSrcConfigForTranslatorService, pathToDesTempConfig)

  compileJsCode(pathToSrcDir, pathToDesDir, pathToConfigForWebpack, willMinifyCode)
  removeFile(pathToDesTempConfig)


def compileJsCode(pathToSrcDir, pathToDesDir, pathToConfigForWebpack, willMinifyCode):
  env = { "pathToSrcDir": pathToSrcDir, "PATH": os.getenv("PATH") }
  if (willMinifyCode == True):
    env['willMinifyCode'] = "1"
  params = ["npx", "webpack", "build", "-c", pathToConfigForWebpack, "-o", pathToDesDir]
  subprocess.run(params, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True, check=True, env=env)


def addBackgroundScript(pathToSrcDir, pathToDesDir):
  pathToBackgroundDesDir = pathToDesDir + "/background"
  makeDir(pathToBackgroundDesDir)
  moveFile(pathToDesDir + "/background.js", pathToBackgroundDesDir + "/script.js")
  makeDir(pathToBackgroundDesDir + "/modules")
  codeOfLanguageToName = "/background/modules/codeOfLanguageToName"

  pathToSrcTranslations = pathToSrcDir + codeOfLanguageToName
  pathToDesTranslations = pathToDesDir + "/" + codeOfLanguageToName
  makeDir(pathToDesTranslations)

  for nameOfFile in os.listdir(pathToSrcTranslations):
    pathToSrcJsFile = os.path.join(pathToSrcTranslations, nameOfFile)
    pathToDesJsFile = os.path.join(pathToDesTranslations, nameOfFile)
    minifyJsFile(pathToSrcJsFile, pathToDesJsFile)


def minifyJsFile(pathToSrcFile, pathToDesFile):
  executeInShell(["npx", "terser", pathToSrcFile, "-o", pathToDesFile])


def addContentScripts(pathToSrcDir, pathToDesDir):
  pathToDesContentScriptsDir = pathToDesDir + "/contentScripts"
  makeDir(pathToDesContentScriptsDir);
  moveFile(pathToDesDir + "/translatingPageScript.js", pathToDesContentScriptsDir + "/translatingPageScript.js")


def addSettingsPage(pathToSrcDir, pathToDesDir, willMinifyCode):
  addExtensionPage(pathToSrcDir, pathToDesDir, "settingsPage", "settings", "settings.js", willMinifyCode)


def addExtensionPage(pathToSrcDir, pathToDesDir, nameOfSrcPageDir, nameOfDesPageDir, nameOfJsFile, willMinifyCode):
  pathToDesPageDir = pathToDesDir + "/" + nameOfDesPageDir
  makeDir(pathToDesPageDir);
  pathToDesPage = pathToDesPageDir + "/page.html"
  copyFile(pathToSrcDir + "/" + nameOfSrcPageDir + "/page.html" , pathToDesPage)
  moveFile(pathToDesDir + "/" + nameOfJsFile, pathToDesPageDir + "/script.js")

  pathToSrcStyle = pathToSrcDir + "/" + nameOfSrcPageDir + "/style.css"
  pathToDesStyle = pathToDesPageDir + "/style.css"

  if willMinifyCode:
    minifyHtmlFileInPlace(pathToDesPage)
    minifyCssFile(pathToSrcStyle, pathToDesStyle)
  else:
    # ok
    minifyCssFile(pathToSrcStyle, pathToDesStyle)


def minifyHtmlFileInPlace(path):
  params = [
    "npx",
    "html-minifier",
    "--collapse-boolean-attributes",
    "--collapse-inline-tag-whitespace",
    "--collapse-whitespace",
    "--keep-closing-slash",
    "--remove-attribute-quotes",
    "--remove-comments",
    "--remove-redundant-attributes",
    path,
    "-o",
    path
  ]
  executeInShell(params)


def minifyCssFile(pathToSrcStyle, pathToDesStyle):
  executeInShell(["npx", "cleancss", pathToSrcStyle, "-o", pathToDesStyle])


def addPopupPage(pathToSrcDir, pathToDesDir, willMinifyCode):
  addExtensionPage(pathToSrcDir, pathToDesDir, "popupPage", "popup", "popup.js", willMinifyCode)


def createExtensionFile(pathToTempDirForExtension, pathToDesDirForResults, nameOfExtensionFile, typeOfBrowser):
  shutil.make_archive(pathToDesDirForResults + "/" + nameOfExtensionFile, "zip", pathToTempDirForExtension)
  if (typeOfBrowser == TypesOfBrowser.FIREFOX):
    endOfFile = ".firefox.xpi"
  else:
    endOfFile = ".chromium.zip"
  desPath = pathToDesDirForResults + "/" + nameOfExtensionFile + endOfFile
  moveFile(pathToDesDirForResults + "/" + nameOfExtensionFile + ".zip", desPath)
