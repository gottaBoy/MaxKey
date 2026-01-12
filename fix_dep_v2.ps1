# fix_dep_v2.ps1
$log = "C:\d\flutter_ws\sophon-sso\MaxKey\fix_log.txt"
"Starting" | Out-File $log

$rootPath = "C:\d\flutter_ws\sophon-sso\MaxKey"
# Use Filter for recursive search which is sometimes more reliable
$files = Get-ChildItem -Path $rootPath -Recurse -Filter "*.gradle" -File

"Found $($files.Count) files" | Out-File $log -Append

foreach ($file in $files) {
    try {
        $path = $file.FullName
        $content = Get-Content -Path $path -Raw
        
        # Replace Sophon- with sophon- (Case Sensitive to target Uppercase)
        # Using -creplace
        $newContent = $content -creplace "Sophon-", "sophon-"
        
        if ($content -ne $newContent) {
            $utf8NoBom = New-Object System.Text.UTF8Encoding $false
            [System.IO.File]::WriteAllText($path, $newContent, $utf8NoBom)
            "Fixed: $path" | Out-File $log -Append
        }
    } catch {
        "Error: $_" | Out-File $log -Append
    }
}
"Done" | Out-File $log -Append
