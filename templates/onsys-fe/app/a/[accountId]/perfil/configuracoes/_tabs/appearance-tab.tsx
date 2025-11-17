"use client"

import { ColorPicker, ColorPickerAlpha, ColorPickerEyeDropper, ColorPickerFormat, ColorPickerHue, ColorPickerOutput, ColorPickerSelection } from "@/_components/color-picker"
import { ThemeToggleButton } from "@/_components/theme-toggle-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/_components/ui/card"
import { Label } from "@/_components/ui/label"

export default function AppearanceTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aparência</CardTitle>
        <CardDescription>Altere as cores da plataforma</CardDescription>
        <div className="border rounded-xl p-4 flex justify-between items-center">
          <div className="space-y-2">
            <Label>Tema</Label>
            <p className="text-sm text-muted-foreground">
              Personalize a aparência da interface
            </p>
          </div>
          <ColorPicker className="max-w-sm rounded-md border bg-background p-4 shadow-sm">
            <ColorPickerSelection />
            <div className="flex items-center gap-4">
              <ColorPickerEyeDropper />
              <div className="grid w-full gap-1">
                <ColorPickerHue />
                <ColorPickerAlpha />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ColorPickerOutput />
              <ColorPickerFormat />
            </div>
          </ColorPicker>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-xl p-4 flex justify-between items-center">
          <div className="space-y-2">
            <Label>Modo de Cor</Label>
            <p className="text-sm text-muted-foreground">
              Use o botão no canto superior direito para alternar entre tema claro e escuro
            </p>
          </div> <ThemeToggleButton />
        </div>
      </CardContent>
    </Card>
  )
}
