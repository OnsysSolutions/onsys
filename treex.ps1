param(
    [string]$Path = ".",
    [string[]]$Exclude = @("node_modules", ".git", ".next", "dist")
)

function Draw-Tree {
    param(
        [string]$CurrentPath,
        [int]$Level
    )

    # Caracteres Unicode corretos no PowerShell
    $pipe =  [char]0x2502         # │
    $tee  =  [char]0x251C + [char]0x2500 + [char]0x2500 + " "   # ├── 
    $last =  [char]0x2514 + [char]0x2500 + [char]0x2500 + " "   # └── 

    # Filtro: ignora pastas por nome
    $items = Get-ChildItem $CurrentPath -Force | Where-Object {
        $Exclude -notcontains $_.Name
    }

    $count = $items.Count
    $index = 0

    foreach ($item in $items) {
        $index++
        $isLast = ($index -eq $count)

        # Prefixo visual
        $prefix = ""
        if ($Level -gt 0) {
            for ($i = 0; $i -lt $Level - 1; $i++) {
                $prefix += "$pipe   "
            }
            $prefix += $(if ($isLast) { $last } else { $tee })
        }

        Write-Output "$prefix$item"

        if ($item.PSIsContainer) {
            Draw-Tree -CurrentPath $item.FullName -Level ($Level + 1)
        }
    }
}

# Caminho raiz
$fullPath = (Resolve-Path $Path).Path
Write-Output $fullPath

Draw-Tree -CurrentPath $fullPath -Level 1
