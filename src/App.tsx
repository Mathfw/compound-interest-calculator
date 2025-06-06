import React, { createContext, useEffect, useState, type Dispatch, type FormEvent, type SetStateAction } from 'react'
import Input from './components/Input'
import FlagUS from './assets/flag-US.svg?react'
import FlagBR from './assets/flag-BR.svg?react'

export const LangContext = createContext<{
  value: string,
  setValue: Dispatch<SetStateAction<string>>
}>({
  value: 'pt-BR',
  setValue: () => {}
});

function App(): React.ReactNode {

  const [start, setStart] = useState('');
  const [monthly, setMonthly] = useState('');
  const [interest, setInterest] = useState('');
  const [period, setPeriod] = useState('');

  const [interestMetric, setInterestMetric] = useState<'months'|'years'>('months');
  const [periodMetric, setPeriodMetric] = useState<'months'|'years'>('months');

  const [out, setOut] = useState<{interest: number, gross: number, total: number}[]>([]);

  const [lang, setLang] = useState('pt-BR');

  useEffect(() => {
    console.log(out);
  }, [out])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let calc: {
      start: number,
      monthly: number,
      interest: number,
      period: number
    } = {start: 0, monthly: 0, interest: 0, period: 0}
    if (lang === 'pt-BR') {
      calc.start = parseFloat(start.replace('.', '<temp-comma>').replace(',', '.').replace('<temp-comma>', ''));
      calc.monthly = parseFloat(monthly.replace('.', '<temp-comma>').replace(',', '.').replace('<temp-comma>', ''));
      calc.interest = interestMetric === 'years' ?  
        parseFloat(interest.replace('.', '<temp-comma>').replace(',', '.').replace('<temp-comma>', '')) / 12 / 100 : 
        parseFloat(interest.replace('.', '<temp-comma>').replace(',', '.').replace('<temp-comma>', '')) / 100;
      calc.period = periodMetric === 'years' ? Math.floor(parseInt(period) * 12) : parseInt(period);
    } else {
      calc.start = parseFloat(start.replace(',', ''));
      calc.monthly = parseFloat(monthly.replace(',', ''));
      calc.interest = interestMetric === 'years' ?
        parseFloat(interest.replace(',', '')) / 12 / 100 :
        parseFloat(interest.replace(',', '')) / 100;
      calc.period = periodMetric === 'years' ? Math.floor(parseInt(period) * 12) : parseInt(period);
    } 
    console.log(calc);
    let outTemp: {interest: number, gross: number, total: number}[] = [];
    let total = 0, gross = calc.start;
    for (let i = 0; i < calc.period; i++) {
      calc.start += calc.monthly;
      gross += calc.monthly;
      total = calc.start * Math.pow(1+calc.interest, 1);
      outTemp.push({
        interest: total - calc.start, 
        gross: gross, 
        total: total
      })
      calc.start = total
    }
    console.log(outTemp);
    setOut(outTemp);
  }

  return (
    <main>
      <LangContext value={{value: lang, setValue: setLang}}>
        <h1>compound interest calculator</h1>
        <button onClick={() => setLang('pt-BR')} style={{ width: '4em', height: '4em' }}>
          <FlagBR />
        </button>
        <button onClick={() => setLang('en-US')} style={{ width: '4em', height: '4em' }}>
          <FlagUS />
        </button>
        <form onSubmit={handleSubmit}>
          <Input value={start} type='money' setValue={(v) => setStart(v)} >
            start investment value
          </Input>
          <Input value={monthly} type='money' setValue={(v) => setMonthly(v)} >
            monthly investment value
          </Input>
          <Input value={interest} type='metric' setValue={(v) => setInterest(v)} metricLabel='in' metricValue={interestMetric} 
            setMetric={(v) => {
              if (v === 'months' || v === 'years') {
                setInterestMetric(v)
              }
            }}>
              interest rate
          </Input>
          <Input value={period} type='metric' setValue={(v) => setPeriod(v)} metricLabel='in' metricValue={periodMetric} 
            setMetric={(v) => {
              if (v === 'months' || v === 'years') {
                setPeriodMetric(v)
              }
            }} >
            period of the investment
          </Input>
          <button type='submit'>
            calculate
          </button>
        </form>
        {
          out ?
          out.map((v, index) => {
            return(
              <p key={index}>interest: {v.interest.toFixed(2)}, gross: {v.gross.toFixed(2)}, total: {v.total.toFixed(2)}</p>
            )
          }) :
          null
        }
      </LangContext>
    </main>
  )
}

export default App
