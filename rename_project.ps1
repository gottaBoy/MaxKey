# rename_project.ps1
$rootPath = $PSScriptRoot
$excludeFolders = @(".git", ".gradle", "build", "bin", "target", ".idea", ".settings", ".vscode", "node_modules")
$extensionsToProcess = @(".java", ".xml", ".gradle", ".properties", ".yml", ".yaml", ".md", ".txt", ".bat", ".sh", ".sql", ".conf", "Dockerfile", "Makefile")

Write-Host "Starting Refactoring Process in $rootPath..." -ForegroundColor Green

# 1. Content Replacement in Files
Write-Host "1. Replacing content in files..." -ForegroundColor Cyan
Get-ChildItem -Path $rootPath -Recurse -File | Where-Object { 
    $ext = $_.Extension
    $name = $_.Name
    $path = $_.FullName
    
    # Check exclusions
    $shouldProcess = $true
    foreach ($exclude in $excludeFolders) {
        if ($path -like "*\$exclude\*") { $shouldProcess = $false; break }
    }
    
    if ($shouldProcess) {
       if ($extensionsToProcess -contains $ext -or $name -eq "Dockerfile" -or $name -eq "Makefile") {
           return $true
       }
    }
    return $false
} | ForEach-Object {
    $file = $_.FullName
    try {
        $encoding = "UTF8"
        # Detect encoding slightly loosely, default to UTF8
        $content = Get-Content -Path $file -Raw -ErrorAction SilentlyContinue
        if ($null -ne $content) {
            $newContent = $content -replace "org\.dromara\.maxkey", "org.zeron.sophon"
            $newContent = $newContent -replace "org/dromara/maxkey", "org/zeron/sophon"
            $newContent = $newContent -replace "MaxKey", "Sophon"
            $newContent = $newContent -replace "maxkey", "sophon" 
            
            if ($content -ne $newContent) {
                Set-Content -Path $file -Value $newContent -Encoding UTF8 -Force
                Write-Host "Updated: $file" -ForegroundColor Gray
            }
        }
    } catch {
        Write-Host "Error processing $file : $_" -ForegroundColor Red
    }
}

# 2. Rename Package Directories (org/dromara/maxkey -> org/zeron/sophon)
Write-Host "2. Moving Java Packages..." -ForegroundColor Cyan
Get-ChildItem -Path $rootPath -Recurse -Directory -Filter "src" | ForEach-Object {
    $srcPath = $_.FullName
    $oldPackagePath = Join-Path $srcPath "main\java\org\dromara\maxkey"
    $newPackagePath = Join-Path $srcPath "main\java\org\zeron\sophon"
    
    if (Test-Path $oldPackagePath) {
        Write-Host "Moving Package: $oldPackagePath -> $newPackagePath"
        New-Item -ItemType Directory -Force -Path $newPackagePath | Out-Null
        Get-ChildItem -Path $oldPackagePath | Move-Item -Destination $newPackagePath -Force
        
        # Cleanup empty old dirs
        Remove-Item -Path $oldPackagePath -Force -Recurse
        # Try remove org/dromara if empty
        $dromaraPath = Join-Path $srcPath "main\java\org\dromara"
        if ((Get-ChildItem $dromaraPath).Count -eq 0) { Remove-Item $dromaraPath -Force }
    }
}

# 3. Rename Project Directories (maxkey-* -> sophon-*)
Write-Host "3. Renaming Directories..." -ForegroundColor Cyan
# Sort by length descending to rename deepest/longest folders first
Get-ChildItem -Path $rootPath -Recurse -Directory | Where-Object { $_.Name -match "maxkey" -and $_.FullName -notmatch "\.git" -and $_.FullName -notmatch "build" } | Sort-Object -Property @{Expression={$_.FullName.Length}} -Descending | ForEach-Object {
    $oldName = $_.Name
    $newName = $oldName -replace "maxkey", "sophon" -replace "MaxKey", "Sophon"
    if ($oldName -ne $newName) {
        $newPath = Join-Path $_.Parent.FullName $newName
        Write-Host "Renaming Folder: $($_.FullName) -> $newPath"
        Rename-Item -Path $_.FullName -NewName $newName -ErrorAction SilentlyContinue
    }
}

Write-Host "Refactoring Complete!" -ForegroundColor Green
