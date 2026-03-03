$ws = New-Object -ComObject WScript.Shell
$desktop = [System.Environment]::GetFolderPath('Desktop')
$s = $ws.CreateShortcut("$desktop\Markdown Editor.lnk")
$s.TargetPath = "c:\Users\7765y\Desktop\markdown_previewApp\run_editor.bat"
$s.IconLocation = "c:\Users\7765y\Desktop\markdown_previewApp\src-tauri\icons\icon.ico"
$s.WorkingDirectory = "c:\Users\7765y\Desktop\markdown_previewApp"
$s.Save()
