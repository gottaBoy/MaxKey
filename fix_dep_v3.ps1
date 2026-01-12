# fix_dep_v3.ps1
$log = "C:\d\flutter_ws\sophon-sso\MaxKey\fix_log_v3.txt"
"Starting V3" | Out-File $log

$rootPath = "C:\d\flutter_ws\sophon-sso\MaxKey"
$files = Get-ChildItem -Path $rootPath -Recurse -Filter "*.gradle" -File

foreach ($file in $files) {
    try {
        $path = $file.FullName
        $content = Get-Content -Path $path -Raw
        
        # Use .NET Replace which is case-sensitive
        if ($content.Contains("Sophon-")) {
            $newContent = $content.Replace("Sophon-", "sophon-")
            $utf8NoBom = New-Object System.Text.UTF8Encoding $false
            [System.IO.File]::WriteAllText($path, $newContent, $utf8NoBom)
            "Fixed: $path" | Out-File $log -Append
        }
    } catch {
        "Error: $_" | Out-File $log -Append
    }
}
"Done" | Out-File $log -Append
