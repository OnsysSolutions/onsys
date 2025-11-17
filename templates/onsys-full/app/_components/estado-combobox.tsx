"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/_components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/_components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/_components/ui/popover"
import { cn } from "@/_lib/utils"

const estados = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
]

export function EstadoCombobox({ name }: { name: string }) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [search, setSearch] = useState("")

  // Filtra pelo label
  const filteredEstados = estados.filter((estado) =>
    estado.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? estados.find((estado) => estado.value === value)?.label
            : "Selecione um estado"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput
            placeholder="Buscar estado..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandEmpty>Nenhum estado encontrado.</CommandEmpty>
          {/* Adiciona scroll e limita altura para mostrar 5 itens */}
          <CommandGroup className="max-h-[220px] overflow-y-auto">
            {filteredEstados.map((estado) => (
              <CommandItem
                key={estado.value}
                value={estado.value}
                onSelect={(currentValue) => {
                  setValue(currentValue)
                  setOpen(false)
                  setSearch("")
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === estado.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {`${estado.value} - ${estado.label}`}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>

      <input type="hidden" name={name} value={value} />
    </Popover>
  )
}
