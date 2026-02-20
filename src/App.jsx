import {useState, useEffect} from 'react'
import '/.index.css'

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
}