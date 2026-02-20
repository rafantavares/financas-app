import {useState, useEffect} from 'react'
import './index.css'
import {PieChart, Pie, Cell, Tooltip, Legend} from 'recharts'

const STORAGE_KEY = 'financas_dados'

function formatReal(valor){
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'})
}

function gerarId(){
  return Date.now().toString()
}

export default function App(){
  const [registros, setRegistros] = useState(() =>{
    const salvo = localStorage.getItem(STORAGE_KEY)
    return salvo ? JSON.parse(salvo): []
  })

  const [ganho, setGanho] = useState ({ descricao: '', valor: '', data: ''})
  const [despesa, setDespesa] = useState ({descricao: '', valor: '', categoria: 'Alimentação', data: ''})

  useEffect(() =>{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registros))
  }, [registros])

  const totalGanhos = registros
    .filter(r => r.tipo === 'ganho')
    .reduce((acc, r) => acc + r.valor, 0)

  const totalDespesas = registros
    .filter(r => r.tipo === 'despesa')
    .reduce((acc, r) => acc + r.valor, 0)

  const saldo = totalGanhos - totalDespesas

  function adicionarGanho(e){
    e.preventDefault()
    if (!ganho.descricao || !ganho.valor || !ganho.data) return
    setRegistros(prev => [...prev, {
      id: gerarId(),
      tipo: 'ganho',
      descricao: ganho.descricao,
      valor: parseFloat(ganho.valor),
      categoria: ganho.categoria,
      data: ganho.data
    }])
    setGanho({descricao: '', valor: '', data: ''})
  }

  function adicionarDespesa(e){
    e.preventDefault()
    if(!despesa.descricao || !despesa.valor || !despesa.data) return
    setRegistros(prev => [...prev, {
      id: gerarId(),
      tipo: 'despesa',
      descricao: despesa.descricao,
      valor: parseFloat(despesa.valor),
      categoria: despesa.categoria,
      data: despesa.data
    }])
    setDespesa({descricao: '', valor: '', categoria: 'Alimentação', data: ''})
  }

  function remover(id){
    setRegistros(prev => prev.filter(r => r.id !== id))
  }

  const ordenados = [...registros].sort((a,b) => new Date(b.data) - new Date(a.data))

  const dadosPizza = Object.entries(
    registros.filter(r => r.tipo === 'despesa')
    .reduce ((acc, r) => {
      acc[r.categoria] = (acc[r.categria] || 0) + r.valor
      return acc
    }, {})
  ).map(([categoria, valor]) => ({name: categoria, value: valor}))

  const CORES = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#ec4899', '#14b8a6']

  return (
    <div className='container'>
      <header>
        <h1> Controle Financeiro </h1>
        <p>Gerenciamento de ganhos e despesas</p>
      </header>

      <div className="cards">
        <div className='card salvo'>
          <h3>Saldo Atual</h3>
          <div className="valor">{formatReal(saldo)}</div>
        </div>
        <div className = "card ganhos">
          <h3>Total de Ganhos</h3>
          <div className="valor">{formatReal(totalGanhos)}</div>
        </div>
        <div className="card despesas">
          <h3>Total de Despesas</h3>
          <div className="valor">{formatReal(totalDespesas)}</div>
        </div>
      </div>

       <div className="painel">
        <div className="box ganhos">
          <h2>+ Adicionar Ganho</h2>
          <form onSubmit={adicionarGanho}>
            <div className="form-group">
              <input
                placeholder="Descrição (ex: Salário)"
                value={ganho.descricao}
                onChange={e => setGanho({ ...ganho, descricao: e.target.value })}
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                placeholder="Valor (R$)"
                min="0"
                step="0.01"
                value={ganho.valor}
                onChange={e => setGanho({ ...ganho, valor: e.target.value })}
              />
            </div>
            <div className="form-group">
              <input
                type="date"
                value={ganho.data}
                onChange={e => setGanho({ ...ganho, data: e.target.value })}
              />
            </div>
            <button type="submit" className="btn ganho">Adicionar Ganho</button>
          </form>
        </div>

        <div className="box despesas">
          <h2>− Adicionar Despesa</h2>
          <form onSubmit={adicionarDespesa}>
            <div className="form-group">
              <input
                placeholder="Descrição (ex: Aluguel)"
                value={despesa.descricao}
                onChange={e => setDespesa({ ...despesa, descricao: e.target.value })}
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                placeholder="Valor (R$)"
                min="0"
                step="0.01"
                value={despesa.valor}
                onChange={e => setDespesa({ ...despesa, valor: e.target.value })}
              />
            </div>
            <div className="form-group">
              <select
                value={despesa.categoria}
                onChange={e => setDespesa({ ...despesa, categoria: e.target.value })}
              >
                <option>Alimentação</option>
                <option>Moradia</option>
                <option>Transporte</option>
                <option>Saúde</option>
                <option>Educação</option>
                <option>Lazer</option>
                <option>Outros</option>
              </select>
            </div>
            <div className="form-group">
              <input
                type="date"
                value={despesa.data}
                onChange={e => setDespesa({ ...despesa, data: e.target.value })}
              />
            </div>
            <button type="submit" className="btn despesa">Adicionar Despesa</button>
          </form>
        </div>
      </div>

      {dadosPizza.length > 0 && (
        <div className="box" style={{ marginBottom: '20px' }}>
          <h2>📊 Gastos por Categoria</h2>
          <PieChart width={400} height={300} style={{ margin: '0 auto' }}>
            <Pie
              data={dadosPizza}
              cx={200}
              cy={140}
              outerRadius={100}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {dadosPizza.map((entry, index) => (
                <Cell key={index} fill={CORES[index % CORES.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatReal(value)} />
          </PieChart>
        </div>
      )}

      <div className="lista">
        <h2>Histórico de Lançamentos</h2>
        {ordenados.length === 0 ? (
          <div className="vazio">Nenhum lançamento ainda. Comece adicionando um ganho ou despesa!</div>
        ) : (
          ordenados.map(r => (
            <div className="item" key={r.id}>
              <div className="item-info">
                <span className="descricao">{r.descricao}</span>
                <span className="detalhe">
                  {new Date(r.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                  {r.categoria ? ` · ${r.categoria}` : ''}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className={`item-valor ${r.tipo}`}>
                  {r.tipo === 'ganho' ? '+' : '-'} {formatReal(r.valor)}
                </span>
                <button className="item-remover" onClick={() => remover(r.id)}>remover</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}