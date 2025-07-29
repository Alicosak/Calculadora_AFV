"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Copy, Calculator, Moon, Sun, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

type UserProfile = "afv"
type RiskLevel = "TL A" | "TL B" | "TL C" | "TL D" | "R(Bajo)" | "R(Medio)" | "R(Alto)"
type Level = "Bronce" | "Plata" | "Oro" | "Zafiro" | "Diamante"

interface ToleranceMatrix {
  [key: string]: {
    [key: string]: number
  }
}

const toleranceMatrix: ToleranceMatrix = {
  "TL A": {
    Bronce: 30,
    Plata: 30,
    Oro: 40,
    Zafiro: 45,
    Diamante: 60,
  },
  "TL B": {
    Bronce: 25,
    Plata: 25,
    Oro: 35,
    Zafiro: 40,
    Diamante: 50,
  },
  "TL C": {
    Bronce: 20,
    Plata: 20,
    Oro: 30,
    Zafiro: 30,
    Diamante: 40,
  },
  "TL D": {
    Bronce: 20,
    Plata: 20,
    Oro: 30,
    Zafiro: 30,
    Diamante: 40,
  },
  "R(Bajo)": {
    Bronce: 30,
    Plata: 30,
    Oro: 40,
    Zafiro: 45,
    Diamante: 60,
  },
  "R(Medio)": {
    Bronce: 25,
    Plata: 25,
    Oro: 35,
    Zafiro: 40,
    Diamante: 50,
  },
  "R(Alto)": {
    Bronce: 20,
    Plata: 20,
    Oro: 30,
    Zafiro: 30,
    Diamante: 40,
  },
}

export default function AFVCalculator() {
  const [darkMode, setDarkMode] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile>("afv")
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("TL A")
  const [level, setLevel] = useState<Level>("Bronce")
  const [basePoints, setBasePoints] = useState<number>(0)
  const [usedPoints, setUsedPoints] = useState<number>(0)
  const [orderPoints, setOrderPoints] = useState<number>(0)
  const [generatedText, setGeneratedText] = useState<string>("")
  const { toast } = useToast()

  // Calculations
  const tolerancePercentage = toleranceMatrix[riskLevel]?.[level] || 0
  const pointsWithTolerance = basePoints + (basePoints * tolerancePercentage) / 100
  const availablePoints = pointsWithTolerance - usedPoints
  const exceeds = availablePoints - orderPoints
  const canRelease = availablePoints >= orderPoints

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  useEffect(() => {
    generateResponseText()
  }, [
    riskLevel,
    level,
    basePoints,
    usedPoints,
    orderPoints,
    tolerancePercentage,
    pointsWithTolerance,
    availablePoints,
    exceeds,
    canRelease,
  ])

  const generateResponseText = () => {
    const deficit = orderPoints > availablePoints ? orderPoints - availablePoints : 0

    const text = `Informar que de acuerdo con las nuevas normativas que han sido planteadas por finanzas. Detallamos caso de su CB:

Puntos base: ${basePoints.toLocaleString()}
Porcentaje de tolerancia: ${tolerancePercentage}%
TL: ${riskLevel.startsWith("TL ") ? riskLevel.replace("TL ", "") : riskLevel}
Nivel: ${level}
Puntos con tolerancia: ${Math.round(pointsWithTolerance).toLocaleString()}
Puntos ya usados: ${usedPoints.toLocaleString()}
Puntos disponibles: ${Math.round(availablePoints).toLocaleString()}
Puntos de pedido a captar: ${orderPoints.toLocaleString()}

${
  orderPoints > availablePoints
    ? `Por tal motivo, pedido no puede ser aprobado, debido que, excede el crédito otorgado en ${Math.round(deficit).toLocaleString()} pts. Recordar también que, GV no está autorizado a liberar pedidos.`
    : `Por lo cual hemos solicitado liberar su pedido, el cual lo visualizará aprobado en unos minutos.`
}`

    setGeneratedText(text)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedText)
      toast({
        title: "¡Copiado!",
        description: "El texto ha sido copiado al portapapeles",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo copiar el texto",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setBasePoints(0)
    setUsedPoints(0)
    setOrderPoints(0)
    setRiskLevel("TL A")
    setLevel("Bronce")
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Calculator className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Calculadora AFV</h1>
          </div>
          <div className="flex items-center gap-4">
            {/* AFV Profile Indicator */}
            <div className="flex items-center gap-2">
              <Badge variant="default" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                AFV
              </Badge>
            </div>
            {/* Dark Mode Toggle */}
            <Button variant="outline" size="icon" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Calculator className="h-5 w-5" />
                Parámetros de Evaluación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Risk and Level Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="risk" className="text-gray-700 dark:text-gray-300">
                    Riesgo
                  </Label>
                  <Select value={riskLevel} onValueChange={(value: RiskLevel) => setRiskLevel(value)}>
                    <SelectTrigger id="risk" className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TL A">TL A</SelectItem>
                      <SelectItem value="TL B">TL B</SelectItem>
                      <SelectItem value="TL C">TL C</SelectItem>
                      <SelectItem value="TL D">TL D</SelectItem>
                      <SelectItem value="R(Bajo)">R(Bajo)</SelectItem>
                      <SelectItem value="R(Medio)">R(Medio)</SelectItem>
                      <SelectItem value="R(Alto)">R(Alto)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level" className="text-gray-700 dark:text-gray-300">
                    Nivel
                  </Label>
                  <Select value={level} onValueChange={(value: Level) => setLevel(value)}>
                    <SelectTrigger id="level" className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bronce">Bronce</SelectItem>
                      <SelectItem value="Plata">Plata</SelectItem>
                      <SelectItem value="Oro">Oro</SelectItem>
                      <SelectItem value="Zafiro">Zafiro</SelectItem>
                      <SelectItem value="Diamante">Diamante</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="basePoints" className="text-gray-700 dark:text-gray-300">
                    Puntos Base
                  </Label>
                  <Input
                    id="basePoints"
                    type="number"
                    min="0"
                    value={basePoints}
                    onChange={(e) => setBasePoints(Math.max(0, Number(e.target.value) || 0))}
                    placeholder="Ingrese los puntos base"
                    className="dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usedPoints" className="text-gray-700 dark:text-gray-300">
                    Puntos Ya Usados
                  </Label>
                  <Input
                    id="usedPoints"
                    type="number"
                    min="0"
                    value={usedPoints}
                    onChange={(e) => setUsedPoints(Math.max(0, Number(e.target.value) || 0))}
                    placeholder="Ingrese los puntos ya usados"
                    className="dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orderPoints" className="text-gray-700 dark:text-gray-300">
                    Puntos del Pedido a Captar
                  </Label>
                  <Input
                    id="orderPoints"
                    type="number"
                    min="0"
                    value={orderPoints}
                    onChange={(e) => setOrderPoints(Math.max(0, Number(e.target.value) || 0))}
                    placeholder="Ingrese los puntos del pedido"
                    className="dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>

              <Button onClick={resetForm} variant="outline" className="w-full bg-transparent">
                Limpiar Formulario
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Resultados del Cálculo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Calculation Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b dark:border-gray-600">
                      <th className="text-left p-2 text-gray-700 dark:text-gray-300">Concepto</th>
                      <th className="text-right p-2 text-gray-700 dark:text-gray-300">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    <tr className="border-b dark:border-gray-700">
                      <td className="p-2 text-gray-600 dark:text-gray-400">Puntos Base</td>
                      <td className="p-2 text-right font-mono">{basePoints.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b dark:border-gray-700">
                      <td className="p-2 text-gray-600 dark:text-gray-400">Riesgo</td>
                      <td className="p-2 text-right font-mono">{riskLevel}</td>
                    </tr>
                    <tr className="border-b dark:border-gray-700">
                      <td className="p-2 text-gray-600 dark:text-gray-400">Nivel</td>
                      <td className="p-2 text-right font-mono">{level}</td>
                    </tr>
                    <tr className="border-b dark:border-gray-700">
                      <td className="p-2 text-gray-600 dark:text-gray-400">Porcentaje de Tolerancia</td>
                      <td className="p-2 text-right font-mono">{tolerancePercentage}%</td>
                    </tr>
                    <tr className="border-b dark:border-gray-700">
                      <td className="p-2 text-gray-600 dark:text-gray-400">Puntos con Tolerancia</td>
                      <td className="p-2 text-right font-mono">{Math.round(pointsWithTolerance).toLocaleString()}</td>
                    </tr>
                    <tr className="border-b dark:border-gray-700">
                      <td className="p-2 text-gray-600 dark:text-gray-400">Puntos Ya Usados</td>
                      <td className="p-2 text-right font-mono">{usedPoints.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b dark:border-gray-700 bg-green-50 dark:bg-green-900/20">
                      <td className="p-2 font-semibold text-green-700 dark:text-green-300">Puntos Disponibles</td>
                      <td className="p-2 text-right font-mono font-semibold text-green-700 dark:text-green-300">
                        {Math.round(availablePoints).toLocaleString()}
                      </td>
                    </tr>
                    <tr className="border-b dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
                      <td className="p-2 font-semibold text-blue-700 dark:text-blue-300">Puntos del Pedido</td>
                      <td className="p-2 text-right font-mono font-semibold text-blue-700 dark:text-blue-300">
                        {orderPoints.toLocaleString()}
                      </td>
                    </tr>
                    <tr
                      className={`border-b dark:border-gray-700 ${exceeds >= 0 ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"}`}
                    >
                      <td
                        className={`p-2 font-semibold ${exceeds >= 0 ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}
                      >
                        Excedente
                      </td>
                      <td
                        className={`p-2 text-right font-mono font-semibold ${exceeds >= 0 ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}
                      >
                        {Math.round(exceeds).toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Status Badge */}
              <div className="flex justify-center">
                <Badge
                  variant={canRelease ? "default" : "destructive"}
                  className={`text-lg px-6 py-3 ${canRelease ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-600 text-white"}`}
                >
                  {canRelease ? "LIBERAR PEDIDO" : "NO SE LIBERA PEDIDO"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Generated Text Section */}
        <Card className="mt-6 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-gray-900 dark:text-white">
              Texto Generado para Respuesta
              <Button onClick={copyToClipboard} className="flex items-center gap-2">
                <Copy className="h-4 w-4" />
                Copiar Texto
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={generatedText}
              readOnly
              className="min-h-[300px] font-mono text-sm dark:bg-gray-700 dark:border-gray-600"
              placeholder="El texto generado aparecerá aquí..."
            />
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  )
}
