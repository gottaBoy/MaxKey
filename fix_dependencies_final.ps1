# fix_dependencies_final.ps1
$rootPath = "C:\d\flutter_ws\sophon-sso\MaxKey"
Write-Host "Scanning $rootPath"

$files = Get-ChildItem -Path $rootPath -Recurse -File | Where-Object { $_.Name -like "*.gradle" }

foreach ($file in $files) {
    $path = $file.FullName
    $content = Get-Content -Path $path -Raw
    
    # Use Case-Sensitive Global Replace
    $newContent = $content -creplace "Sophon-", "sophon-"
    $newContent = $newContent -creplace "Sophon-", "sophon-" 
    # Just replace all "Sophon-" with "sophon-" case-sensitively. 
    # This covers :Sophon-, /Sophon-, 'Sophon-, "Sophon- etc.
    
    if ($content -ne $newContent) {
       $utf8NoBom = New-Object System.Text.UTF8Encoding $false
       [System.IO.File]::WriteAllText($path, $newContent, $utf8NoBom)
       Write-Host "Fixed: $path"
    }
}
