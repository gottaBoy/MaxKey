# fix_dependencies.ps1
$rootPath = $PSScriptRoot

Get-ChildItem -Path $rootPath -Recurse -File | Where-Object { $_.Name -like "*.gradle" } | ForEach-Object {
    $path = $_.FullName
    try {
        $content = Get-Content -Path $path -Raw
        # Normalize :Sophon- to :sophon-
        # Normalize /Sophon- to /sophon- (dependencies)
        # Normalize 'Sophon- to 'sophon- (project names)
        
        $newContent = $content -replace ":Sophon-", ":sophon-"
        $newContent = $newContent -replace "/Sophon-", "/sophon-"
        $newContent = $newContent -replace "'Sophon-", "'sophon-"
        $newContent = $newContent -replace '"Sophon-', '"sophon-'
        
        if ($content -ne $newContent) {
            $utf8NoBom = New-Object System.Text.UTF8Encoding $false
            [System.IO.File]::WriteAllText($path, $newContent, $utf8NoBom)
            Write-Host "Fixed: $path"
        }
    } catch {
        Write-Host "Error processing $path : $_"
    }
}
