import React, { useState, useEffect, useCallback } from 'react'
import ReactGA from 'react-ga4'
import { CurrencyInput } from 'react-currency-mask'
import emoji1 from './emojis/emoji-1.png'
import emoji2 from './emojis/emoji-2.png'
import emoji3 from './emojis/emoji-3.png'
import emoji4 from './emojis/emoji-4.png'
import emoji5 from './emojis/emoji-5.png'
import emoji6 from './emojis/emoji-6.png'

function App() {
  const [salario, setSalario] = useState('')
  const [descontoINSS, setDescontoINSS] = useState(0)
  const [aliquotaINSS, setAliquotaINSS] = useState('')
  const [descontoIRRF, setDescontoIRRF] = useState(0)
  const [aliquotaIRRF, setAliquotaIRRF] = useState('')
  const [valorFGTS, setValorFGTS] = useState(0)
  const [valor13, setValor13] = useState(0)
  const [tercoFerias, setTercoFerias] = useState(0)
  const [salarioRestante, setSalarioRestante] = useState(0)
  const [totalDescontos, setTotalDescontos] = useState(0)
  const [aplicarINSS, setAplicarINSS] = useState(false)
  const [aplicarIRRF, setAplicarIRRF] = useState(false)
  const [aplicarFGTS, setAplicarFGTS] = useState(false)
  const [aplicar13, setAplicar13] = useState(false)
  const [aplicarTercoFerias, setAplicarTercoFerias] = useState(false)
  const totalDescontosAplicados = [aplicarINSS, aplicarIRRF, aplicarFGTS, aplicar13, aplicarTercoFerias].filter(Boolean).length
  const emojis = [emoji1, emoji2, emoji3, emoji4, emoji5, emoji6]
  const emojiAtual = emojis[totalDescontosAplicados]

  useEffect(() => {
    const trackingId = process.env.REACT_APP_GOOGLE_ANALYTICS_ID
    if (trackingId) {
      ReactGA.initialize(trackingId)
    }
  }, [])

  const calcularINSS = (salario) => {
    if (salario <= 1039) {
      setAliquotaINSS('7,5%')
      return salario * 0.075
    } else if (salario <= 2089.60) {
      setAliquotaINSS('9%')
      return salario * 0.09
    } else if (salario <= 3134.40) {
      setAliquotaINSS('12%')
      return salario * 0.12
    } else {
      setAliquotaINSS('14%')
      return salario * 0.14
    }
  }

  const calcularIRRF = (salarioComDescontoINSS) => {
    if (salarioComDescontoINSS <= 1903.98) {
      setAliquotaIRRF('Isento')
      return 0
    } else if (salarioComDescontoINSS <= 2826.65) {
      setAliquotaIRRF('7,5%');
      return salarioComDescontoINSS * 0.075
    } else if (salarioComDescontoINSS <= 3751.05) {
      setAliquotaIRRF('15%')
      return salarioComDescontoINSS * 0.15
    } else if (salarioComDescontoINSS <= 4664.68) {
      setAliquotaIRRF('22,5%')
      return salarioComDescontoINSS * 0.225
    } else {
      setAliquotaIRRF('27,5%')
      return salarioComDescontoINSS * 0.275
    }
  }

  const calcularFGTS = (salario) => {
    return salario * 0.08
  }

  const calcular13 = (salario) => {
    const valorBaseFerias = salario / 12
    return valorBaseFerias
  }

  const calcularTercoFerias = (valor13) => {
    const valorBaseFerias = valor13 / 12
    return valorBaseFerias / 3
  }

  const calcular = useCallback(() => {
    const salarioNumerico = parseFloat(salario) || 0
    let descontoINSS = aplicarINSS ? calcularINSS(salarioNumerico) : 0
    let descontoIRRF = aplicarIRRF ? calcularIRRF(salarioNumerico - descontoINSS) : 0
    let descontoFGTS = aplicarFGTS ? calcularFGTS(salarioNumerico) : 0
    let valor13Calculado = aplicar13 ? calcular13(salarioNumerico) : 0
    let tercoFeriasCalculado = aplicarTercoFerias ? calcularTercoFerias(salarioNumerico) : 0

    const totalDescontos = descontoINSS + descontoIRRF + descontoFGTS + valor13Calculado + tercoFeriasCalculado
    const salarioRestante = salarioNumerico - totalDescontos

    setDescontoINSS(descontoINSS)
    setDescontoIRRF(descontoIRRF)
    setValorFGTS(descontoFGTS)
    setValor13(valor13Calculado)
    setTercoFerias(tercoFeriasCalculado)
    setTotalDescontos(totalDescontos)
    setSalarioRestante(salarioRestante)
  }, [salario, aplicarINSS, aplicarIRRF, aplicarFGTS, aplicar13, aplicarTercoFerias])

  useEffect(() => {
    calcular()
  }, [calcular])

  return (
    <div className="App">
      <main className='App-Content'>
        <div className='container'>
          <div className='line block mb-2rem'>
            <h1>Salarium/ <img src={emojiAtual} alt="Emoji" /></h1>
            <p>MEI, descubra seu salário líquido depois de reservar todos os encargos da CLT (INSS, IRRF, FGTS, Férias e 13)</p>
          </div>

          <div className='line mb-2rem'>
            <CurrencyInput
              onChangeValue={(event, originalValue, maskedValue) => {
                setSalario(originalValue)
              }}
              placeholder="Insira o salário bruto"
              type="text"
              value={salario}
            />
          </div>

          <div className='line' >
            <label>
              <input
                type="checkbox"
                checked={aplicarINSS}
                onChange={(e) => setAplicarINSS(e.target.checked)}
              /> Descontar INSS
            </label>
            <div>
              {aplicarINSS && (
                <p>[Alíquota {aliquotaINSS} - R$ {descontoINSS.toFixed(2)}]</p>
              )}
            </div>
          </div>

          <div className='line'>
            <label>
              <input
                type="checkbox"
                checked={aplicarIRRF}
                onChange={(e) => setAplicarIRRF(e.target.checked)}
              /> Descontar IRRF
            </label>
            <div>
                {aplicarIRRF && (
                  <p>[Alíquota {aliquotaIRRF} - R$ {descontoIRRF.toFixed(2)}]</p>
                )}
            </div>
          </div>

          <div className='line'>
            <label>
                <input
                  type="checkbox"
                  checked={aplicarFGTS}
                  onChange={(e) => setAplicarFGTS(e.target.checked)}
                /> Descontar FGTS
              </label>
              <div>
                {aplicarFGTS && (
                  <p>[Alíquota 8% - R$ {valorFGTS.toFixed(2)}]</p>
                )}
              </div>
          </div>

          <div className='line'>
            <label>
              <input
                type="checkbox"
                checked={aplicar13}
                onChange={(e) => setAplicar13(e.target.checked)}
              /> Descontar décimo terceiro
            </label>
            <div>
              {aplicar13 && (
                <p>[R$ {valor13.toFixed(2)}]</p>
              )}
            </div>
          </div>

          <div className='line'>
            <label>
              <input
                type="checkbox"
                checked={aplicarTercoFerias}
                onChange={(e) => setAplicarTercoFerias(e.target.checked)}
              /> Descontar 1/3 de férias
            </label>
            <div>
              {aplicarTercoFerias && (
                <p>[R$ {tercoFerias.toFixed(2)}]</p>
              )}
            </div>
          </div>

          <div className='line mb-2rem'>
            <p>Total de descontos: R$ {totalDescontos.toFixed(2)}</p>
          </div>
          <div className='line resultado mb-2rem'>
            <p>Salário líquido: R$ {salarioRestante.toFixed(2)}</p>
          </div>

          <p className='small'>*os valores são calculados com base nas alíquotas de 2023 e possuem caráter informativo.</p>

        </div>
      </main>

      <footer className='App-Footer'>
        <div className='container'>
          <p>Desenvolvido por <a target="_blank" href="https://everaldo.dev/" rel="noreferrer">EveraldoDev</a> | 2024</p>
        </div>
      </footer>
    </div>
  )
}

export default App