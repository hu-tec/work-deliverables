Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
folder = fso.GetParentFolderName(WScript.ScriptFullName)
shell.CurrentDirectory = folder

command = "cmd /c ""where py >nul 2>nul && py -3 app.py || python app.py"""
shell.Run command, 1, True
