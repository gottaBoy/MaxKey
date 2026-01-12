# fix_dependencies_debug.ps1
$rootPath = "C:\d\flutter_ws\sophon-sso\MaxKey"
Write-Host "Scanning $rootPath"

$files = Get-ChildItem -Path $rootPath -Recurse -File | Where-Object { $_.Name -like "*.gradle" }
Write-Host "Found $($files.Count) gradle files."

foreach ($file in $files) {
    $path = $file.FullName
    $content = Get-Content -Path $path -Raw
    
    # Check if matching
    if ($content -match ":Sophon-") {
        Write-Host "Match found in $path"
        $newContent = $content -replace ":Sophon-", ":sophon-"
        $newContent = $newContent -replace "/Sophon-", "/sophon-"
         
        if ($content -ne $newContent) {
           $utf8NoBom = New-Object System.Text.UTF8Encoding $false
           [System.IO.File]::WriteAllText($path, $newContent, $utf8NoBom)
           Write-Host "Fixed: $path"
        } else {
            Write-Host "Content matched but not replaced? Regex issue."
        }
    }
}
