'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [abaAtiva, setAbaAtiva] = useState<'equipamentos' | 'clientes' | 'locacoes' | 'financeiro'>('locacoes')

  const [equipamentos, setEquipamentos] = useState<any[]>([])
  const [loadingEq, setLoadingEq] = useState(true)
  const [nomeEq, setNomeEq] = useState('')
  const [marcaEq, setMarcaEq] = useState('')
  const [serieEq, setSerieEq] = useState('')
  const [salvandoEq, setSalvandoEq] = useState(false)

  const [clientes, setClientes] = useState<any[]>([])
  const [loadingCli, setLoadingCli] = useState(true)
  const [editandoCliId, setEditandoCliId] = useState<any>(null)
  const [nomeClinica, setNomeClinica] = useState('')
  const [nomeContato, setNomeContato] = useState('')
  const [telefone, setTelefone] = useState('')
  const [cep, setCep] = useState('')
  const [rua, setRua] = useState('')
  const [numero, setNumero] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState('')
  const [salvandoCli, setSalvandoCli] = useState(false)

  const [locacoes, setLocacoes] = useState<any[]>([])
  const [loadingLoc, setLoadingLoc] = useState(true)
  const [editandoLocId, setEditandoLocId] = useState<any>(null) // NOVO
  const [eqLocacaoId, setEqLocacaoId] = useState('')
  const [cliLocacaoId, setCliLocacaoId] = useState('')
  const [dataLocacao, setDataLocacao] = useState('')
  const [ultimaDataLocada, setUltimaDataLocada] = useState('')
  const [valorUltimaLocacao, setValorUltimaLocacao] = useState('')
  const [valorAtual, setValorAtual] = useState('')
  const [proximaLocacao, setProximaLocacao] = useState('')
  
  const [formaPagamento, setFormaPagamento] = useState('Pix')
  const [valorPagamento1, setValorPagamento1] = useState('')
  const [valorPagamento2, setValorPagamento2] = useState('')
  
  const [observacaoLoc, setObservacaoLoc] = useState('') // NOVO
  const [tempoLocacao, setTempoLocacao] = useState('') // NOVO

  const [kmRodados, setKmRodados] = useState('')
  const [tipoCombustivel, setTipoCombustivel] = useState('Gasolina')
  const [precoCombustivel, setPrecoCombustivel] = useState('')
  const [valorPedagio, setValorPedagio] = useState('')
  const [valorRefeicao, setValorRefeicao] = useState('')
  const [valorHospedagem, setValorHospedagem] = useState('')
  const [calculandoKm, setCalculandoKm] = useState(false)
  const [salvandoLoc, setSalvandoLoc] = useState(false)

  const [transacoes, setTransacoes] = useState<any[]>([])
  const [loadingFin, setLoadingFin] = useState(true)
  const [tipoTransacao, setTipoTransacao] = useState('Entrada')
  const [categoriaFin, setCategoriaFin] = useState('Outros')
  const [descricaoFin, setDescricaoFin] = useState('')
  const [valorFin, setValorFin] = useState('')
  const [dataFin, setDataFin] = useState('')
  const [salvandoFin, setSalvandoFin] = useState(false)

  const [dataInicioRel, setDataInicioRel] = useState('')
  const [dataFimRel, setDataFimRel] = useState('')
  const [filtroLocDataInicio, setFiltroLocDataInicio] = useState('')
  const [filtroLocDataFim, setFiltroLocDataFim] = useState('')
  const [filtroLocEq, setFiltroLocEq] = useState('')
  const [filtroLocCli, setFiltroLocCli] = useState('')

  const CEP_ORIGEM_FIXO = '87083-685'

  function formatarMoeda(valor: number) {
    return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  async function buscarEquipamentos() {
    setLoadingEq(true)
    const { data } = await supabase.from('equipamentos').select('*').order('id', { ascending: false })
    setEquipamentos(data || [])
    setLoadingEq(false)
  }

  async function buscarClientes() {
    setLoadingCli(true)
    const { data } = await supabase.from('clientes').select('*').order('id', { ascending: false })
    setClientes(data || [])
    setLoadingCli(false)
  }

  async function buscarLocacoes() {
    setLoadingLoc(true)
    const { data: locs, error } = await supabase
      .from('locacoes')
      .select('*')
      .order('id', { ascending: false })

    if (error) {
      console.error('Erro ao buscar locações:', error)
      setLoadingLoc(false)
      return
    }

    setLocacoes(locs || [])
    setLoadingLoc(false)
  }

  async function buscarFinanceiro() {
    setLoadingFin(true)
    const { data } = await supabase
      .from('financeiro')
      .select('*')
      .order('data_transacao', { ascending: false })
    setTransacoes(data || [])
    setLoadingFin(false)
  }

  useEffect(() => {
    async function carregarTudo() {
      await Promise.all([buscarEquipamentos(), buscarClientes()])
      await buscarLocacoes()
      await buscarFinanceiro()
    }
    carregarTudo()
  }, [])

  async function obterCoordenadas(cepStr: string, cidadeStr: string) {
    const limpo = cepStr.replace(/\D/g, '')
    if (limpo.length === 8) {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&postalcode=${limpo}&country=Brazil&limit=1`, {
          headers: { 'User-Agent': 'PortalEsteticaMaringa/2.0' }
        })
        const data = await res.json()
        if (data && data.length > 0) return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) }
      } catch (e) { console.error(e) }
    }
    if (cidadeStr) {
      try {
        const queryBusca = cidadeStr.includes('PR') ? cidadeStr : `${cidadeStr}, PR, Brazil`
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryBusca)}&limit=1`, {
          headers: { 'User-Agent': 'PortalEsteticaMaringa/2.0' }
        })
        const data = await res.json()
        if (data && data.length > 0) return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) }
      } catch (e) { console.error(e) }
    }
    return null
  }

  async function calcularKmAutomatico(cepCliente: string, cidadeCliente: string) {
    setCalculandoKm(true)
    try {
      const origemCoord = await obterCoordenadas(CEP_ORIGEM_FIXO, 'Maringá - PR')
      const destinoCoord = await obterCoordenadas(cepCliente, cidadeCliente)

      if (origemCoord && destinoCoord) {
        const url = `https://router.project-osrm.org/route/v1/driving/${origemCoord.lon},${origemCoord.lat};${destinoCoord.lon},${destinoCoord.lat}?overview=false`
        const res = await fetch(url)
        const data = await res.json()
        if (data.routes && data.routes.length > 0) {
          const kmSoIda = data.routes[0].distance / 1000
          setKmRodados((kmSoIda * 2).toFixed(1))
          setCalculandoKm(false)
          return
        }
      }
      setKmRodados(cidadeCliente.toLowerCase().includes('faxinal') ? '260.0' : '100.0')
    } catch (err) {
      setKmRodados('100.0')
    } finally {
      setCalculandoKm(false)
    }
  }

  async function handleClienteOuEquipamentoChange(cliId: string, eqId: string) {
    if (!cliId) return
    const clienteEncontrado = clientes.find(c => String(c.id).trim() === String(cliId).trim())
    if (clienteEncontrado) {
      const isFora = clienteEncontrado.cidade && !clienteEncontrado.cidade.toLowerCase().includes('maringá')
      if (isFora) await calcularKmAutomatico(clienteEncontrado.cep, clienteEncontrado.cidade)
      else setKmRodados('')
    }
    if (!eqId) return
    const { data } = await supabase
      .from('locacoes')
      .select('data_locacao, valor_atual')
      .eq('cliente_id', cliId)
      .eq('equipamento_id', eqId)
      .order('data_locacao', { ascending: false })
      .limit(1)

    if (data && data.length > 0) {
      setUltimaDataLocada(data[0].data_locacao || '')
      setValorUltimaLocacao(data[0].valor_atual ? String(data[0].valor_atual) : '')
    } else {
      setUltimaDataLocada('')
      setValorUltimaLocacao('')
    }
  }

  async function handleCepBlur(e: React.FocusEvent<HTMLInputElement>) {
    const cepLimpo = e.target.value.replace(/\D/g, '')
    if (cepLimpo.length !== 8) return
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const data = await res.json()
      if (!data.erro) {
        setRua(data.logradouro || '')
        setBairro(data.bairro || '')
        setCidade(`${data.localidade} - ${data.uf}`)
      }
    } catch (err) { console.error(err) }
  }

  async function handleSalvarCliente(e: React.FormEvent) {
    e.preventDefault()
    if (!nomeClinica) return alert('Informe o nome da clínica.')
    setSalvandoCli(true)
    if (editandoCliId) {
      await supabase.from('clientes').update({ nome_clinica: nomeClinica, nome_contato: nomeContato, telefone, cep, rua, numero, bairro, cidade }).eq('id', editandoCliId)
    } else {
      const { data: ultimoCliente } = await supabase.from('clientes').select('id').order('id', { ascending: false }).limit(1)
      const proximoId = ultimoCliente && ultimoCliente.length > 0 ? Number(ultimoCliente[0].id) + 1 : 1
      const codigoFormatado = `CLI-${proximoId < 10 ? '0' + proximoId : proximoId}`
      await supabase.from('clientes').insert([{ codigo: codigoFormatado, nome_clinica: nomeClinica, nome_contato: nomeContato, telefone, cep, rua, numero, bairro, cidade }])
    }
    limparFormularioCliente()
    buscarClientes()
    setSalvandoCli(false)
  }

  function limparFormularioCliente() {
    setEditandoCliId(null); setNomeClinica(''); setNomeContato(''); setTelefone(''); setCep(''); setRua(''); setNumero(''); setBairro(''); setCidade('')
  }

  function handleEditarCliente(cli: any) {
    setEditandoCliId(cli.id); setNomeClinica(cli.nome_clinica || ''); setNomeContato(cli.nome_contato || ''); setTelefone(cli.telefone || ''); setCep(cli.cep || ''); setRua(cli.rua || ''); setNumero(cli.numero || ''); setBairro(cli.bairro || ''); setCidade(cli.cidade || '')
  }

  async function handleExcluirCli(id: any) {
    if (!confirm('Deseja excluir este cliente?')) return
    await supabase.from('clientes').delete().eq('id', id)
    buscarClientes()
  }

  async function handleCadastrarEq(e: React.FormEvent) {
    e.preventDefault()
    if (!nomeEq || !marcaEq || !serieEq) return alert('Preencha todos os campos.')
    setSalvandoEq(true)
    await supabase.from('equipamentos').insert([{ nome: nomeEq, marca: marcaEq, numero_serie: serieEq, status: 'Disponível' }])
    setNomeEq(''); setMarcaEq(''); setSerieEq('')
    buscarEquipamentos()
    setSalvandoEq(false)
  }

  async function handleExcluirEq(id: any) {
    if (!confirm('Deseja excluir?')) return
    await supabase.from('equipamentos').delete().eq('id', id)
    buscarEquipamentos()
  }

  const clienteSelecionado = clientes.find(c => String(c.id).trim() === String(cliLocacaoId).trim())
  const isForaDeMaringa = clienteSelecionado && clienteSelecionado.cidade && !clienteSelecionado.cidade.toLowerCase().includes('maringá')

  const kmNum = parseFloat(kmRodados) || 0
  const precoCombNum = parseFloat(precoCombustivel) || 0
  const kmNum = parseFloat(kmRodados) || 0
  const precoCombNum = parseFloat(precoCombustivel) || 0
  const rendimento = tipoCombustivel === 'Álcool' ? 8.0 : 11.0 // Ajustado para a média da Fiorino 1.4
  const custoCombustivelCalculado = (kmNum / rendimento) * precoCombNum
  const custoTotalOperacional = isForaDeMaringa ? (custoCombustivelCalculado + (parseFloat(valorPedagio) || 0) + (parseFloat(valorRefeicao) || 0) + (parseFloat(valorHospedagem) || 0)) : 0
  const custoTotalOperacional = isForaDeMaringa ? (custoCombustivelCalculado + (parseFloat(valorPedagio) || 0) + (parseFloat(valorRefeicao) || 0) + (parseFloat(valorHospedagem) || 0)) : 0
  async function handleCadastrarLocacao(e: React.FormEvent) {
    e.preventDefault()
    if (!eqLocacaoId || !cliLocacaoId || !dataLocacao || !valorAtual || !formaPagamento) return alert('Preencha os campos obrigatórios.')

    let textoPagamentoFinal = formaPagamento
    if (formaPagamento.includes('+')) {
      if (!valorPagamento1 || !valorPagamento2) return alert('Informe os dois valores de pagamento.')
      const partes = formaPagamento.split(' + ')
      textoPagamentoFinal = `${partes[0]} (R$ ${parseFloat(valorPagamento1).toFixed(2)}) + ${partes[1]} (R$ ${parseFloat(valorPagamento2).toFixed(2)})`
    }

    let diasPassados = null
    if (ultimaDataLocada) {
      const diffTime = Math.abs(new Date(dataLocacao).getTime() - new Date(ultimaDataLocada).getTime())
      diasPassados = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    setSalvandoLoc(true)
    const valorLocacaoNum = parseFloat(valorAtual)

    const dadosLocacaoPayload = {
      equipamento_id: eqLocacaoId,
      cliente_id: cliLocacaoId,
      data_locacao: dataLocacao,
      ultima_data_locada: ultimaDataLocada || null,
      dias_entre_locacoes: diasPassados,
      valor_ultima_locacao: valorUltimaLocacao ? parseFloat(valorUltimaLocacao) : null,
      valor_atual: valorLocacaoNum,
      proxima_locacao: proximaLocacao || null,
      forma_pagamento: textoPagamentoFinal,
      observacao: observacaoLoc || null, // NOVO
      tempo_locacao: tempoLocacao || null, // NOVO
      km_rodados: isForaDeMaringa && kmRodados ? kmNum : null,
      tipo_combustivel: isForaDeMaringa ? tipoCombustivel : null,
      preco_combustivel: isForaDeMaringa && precoCombustivel ? precoCombNum : null,
      custo_combustivel: isForaDeMaringa ? custoCombustivelCalculado : null,
      valor_pedagio: isForaDeMaringa && valorPedagio ? parseFloat(valorPedagio) : null,
      valor_refeicao: isForaDeMaringa && valorRefeicao ? parseFloat(valorRefeicao) : null,
      valor_hospedagem: isForaDeMaringa && valorHospedagem ? parseFloat(valorHospedagem) : null,
      custo_total_operacional: isForaDeMaringa ? custoTotalOperacional : null,
      status_pagamento: editandoLocId ? undefined : 'Pendente'
    }

    if (editandoLocId) {
      const { error } = await supabase.from('locacoes').update(dadosLocacaoPayload).eq('id', editandoLocId)
      if (error) {
        alert('Erro ao atualizar locação: ' + error.message)
      } else {
        alert('Locação atualizada com sucesso!')
        limparFormularioLocacao()
        buscarLocacoes()
        buscarFinanceiro()
      }
    } else {
      const { error } = await supabase.from('locacoes').insert([dadosLocacaoPayload])
      if (!error) {
        if (isForaDeMaringa && custoTotalOperacional > 0) {
          await supabase.from('financeiro').insert([{
            tipo: 'Saida',
            categoria: 'Custo Viagem / Operacional',
            descricao: `Custos viagem (KM/Pedágio/Hospedagem) - Cliente ID ${cliLocacaoId}`,
            valor: custoTotalOperacional,
            data_transacao: dataLocacao
          }])
        }
        alert('Locação registrada com sucesso!')
        limparFormularioLocacao()
        buscarLocacoes()
        buscarFinanceiro()
      } else {
        alert('Erro ao registrar: ' + error.message)
      }
    }
    setSalvandoLoc(false)
  }

  function limparFormularioLocacao() {
    setEditandoLocId(null)
    setEqLocacaoId(''); setCliLocacaoId(''); setDataLocacao(''); setUltimaDataLocada(''); setValorUltimaLocacao(''); setValorAtual(''); setProximaLocacao(''); setFormaPagamento('Pix'); setValorPagamento1(''); setValorPagamento2(''); setObservacaoLoc(''); setTempoLocacao(''); setKmRodados(''); setPrecoCombustivel(''); setValorPedagio(''); setValorRefeicao(''); setValorHospedagem('')
  }

  // NOVA FUNÇÃO: Editar Locação
  function handleEditarLocacao(loc: any) {
    setEditandoLocId(loc.id)
    setEqLocacaoId(loc.equipamento_id || '')
    setCliLocacaoId(loc.cliente_id || '')
    setDataLocacao(loc.data_locacao || '')
    setUltimaDataLocada(loc.ultima_data_locada || '')
    setValorUltimaLocacao(loc.valor_ultima_locacao ? String(loc.valor_ultima_locacao) : '')
    setValorAtual(loc.valor_atual ? String(loc.valor_atual) : '')
    setProximaLocacao(loc.proxima_locacao || '')
    setFormaPagamento(loc.forma_pagamento || 'Pix')
    setObservacaoLoc(loc.observacao || '')
    setTempoLocacao(loc.tempo_locacao || '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleConfirmarPagamento(locacao: any) {
    if (!confirm('Confirmar o recebimento desta locação e gerar lançamento no financeiro?')) return

    const { error: erroUpdate } = await supabase
      .from('locacoes')
      .update({ status_pagamento: 'Pago' })
      .eq('id', locacao.id)

    if (!erroUpdate) {
      const clienteDaLoc = clientes.find(c => String(c.id).trim() === String(locacao.cliente_id).trim())
      const nomeCli = clienteDaLoc ? clienteDaLoc.nome_clinica : `ID ${locacao.cliente_id}`

      await supabase.from('financeiro').insert([{
        tipo: 'Entrada',
        categoria: 'Locação de Equipamento',
        descricao: `Recebimento Locação - ${nomeCli} (${locacao.forma_pagamento})`,
        valor: locacao.valor_atual,
        data_transacao: new Date().toISOString().split('T')[0] 
      }])

      buscarLocacoes()
      buscarFinanceiro()
    } else {
      alert('Erro ao confirmar pagamento: ' + erroUpdate.message)
    }
  }

  async function handleExcluirLocacao(id: any) {
    if (!confirm('Deseja excluir?')) return
    await supabase.from('locacoes').delete().eq('id', id)
    buscarLocacoes()
  }

  async function handleSalvarFinanceiro(e: React.FormEvent) {
    e.preventDefault()
    if (!descricaoFin || !valorFin || !dataFin) {
      alert('Preencha os campos obrigatórios.')
      return
    }
    setSalvandoFin(true)
    await supabase.from('financeiro').insert([{
      tipo: tipoTransacao,
      categoria: categoriaFin,
      descricao: descricaoFin,
      valor: parseFloat(valorFin),
      data_transacao: dataFin
    }])

    setDescricaoFin(''); setValorFin(''); setDataFin('')
    buscarFinanceiro()
    setSalvandoFin(false)
  }

  async function handleExcluirTransacao(id: any) {
    if (!confirm('Deseja excluir esta transação financeira?')) return
    await supabase.from('financeiro').delete().eq('id', id)
    buscarFinanceiro()
  }

  const transacoesFiltradas = transacoes.filter(t => {
    if (!dataInicioRel && !dataFimRel) return true
    const dataTrans = t.data_transacao
    if (dataInicioRel && dataTrans < dataInicioRel) return false
    if (dataFimRel && dataTrans > dataFimRel) return false
    return true
  })

  const totalTransacoesEntrada = transacoesFiltradas.filter(t => t.tipo === 'Entrada').reduce((acc, t) => acc + Number(t.valor), 0)
  
  const locacoesFiltradas = locacoes.filter(l => {
    if (!dataInicioRel && !dataFimRel) return true
    const dataLoc = l.data_locacao
    if (dataInicioRel && dataLoc < dataInicioRel) return false
    if (dataFimRel && dataLoc > dataFimRel) return false
    return true
  })

  const totalLocacoesAntigas = locacoesFiltradas
    .filter(l => !l.status_pagamento)
    .reduce((acc, l) => acc + Number(l.valor_atual || 0), 0)
  
  const totalEntradas = totalLocacoesAntigas + totalTransacoesEntrada

  const totalSaidas = transacoesFiltradas.filter(t => t.tipo === 'Saida').reduce((acc, t) => acc + Number(t.valor), 0)
  const saldoLiquido = totalEntradas - totalSaidas

  const resumoSaidasPorCategoria = transacoesFiltradas
    .filter(t => t.tipo === 'Saida')
    .reduce((acc: any, t) => {
      acc[t.categoria] = (acc[t.categoria] || 0) + Number(t.valor)
      return acc
    }, {})

  const resumoEntradasPorCategoria = transacoesFiltradas
    .filter(t => t.tipo === 'Entrada')
    .reduce((acc: any, t) => {
      acc[t.categoria] = (acc[t.categoria] || 0) + Number(t.valor)
      return acc
    }, {})

  const isPagamentoDuplo = formaPagamento.includes('+')
  const partesFormaPag = formaPagamento.split(' + ')

  const locacoesPorEquipamento = equipamentos.map(eq => {
    const listaDaEq = locacoesFiltradas.filter(l => String(l.equipamento_id).trim() === String(eq.id).trim())
    return {
      equipamento: eq,
      locacoes: listaDaEq.map(loc => {
        const cli = clientes.find(c => String(c.id).trim() === String(loc.cliente_id).trim())
        return {
          ...loc,
          clientes: cli || { nome_clinica: 'Clínica não encontrada', nome_contato: '', cidade: '' }
        }
      })
    }
  })
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Cabeçalho refinado */}
        <div className="no-print bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.jpg" 
              alt="Lumera Tech Logo" 
              className="w-12 h-12 object-cover rounded-full shadow border border-gray-200" 
            />
            <div>
              <h1 className="text-xl font-bold text-gray-800">LUMERA TECH - Estética</h1>
              <p className="text-gray-500 text-xs">Controle operacional de Equipamentos, Clientes, Locações e Financeiro</p>
            </div>
          </div>
          <button 
            onClick={() => window.print()} 
            className="bg-gray-800 hover:bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow flex items-center gap-1.5 transition"
          >
            🖨️ Imprimir / Salvar PDF
          </button>
        </div>

        <div className="no-print flex border-b border-gray-200 overflow-x-auto">
          <button onClick={() => setAbaAtiva('equipamentos')} className={`py-2 px-6 font-semibold text-sm border-b-2 whitespace-nowrap ${abaAtiva === 'equipamentos' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`}>
            Equipamentos ({equipamentos.length})
          </button>
          <button onClick={() => setAbaAtiva('clientes')} className={`py-2 px-6 font-semibold text-sm border-b-2 whitespace-nowrap ${abaAtiva === 'clientes' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`}>
            Clientes / Clínicas ({clientes.length})
          </button>
          <button onClick={() => setAbaAtiva('locacoes')} className={`py-2 px-6 font-semibold text-sm border-b-2 whitespace-nowrap ${abaAtiva === 'locacoes' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`}>
            Controle de Locações ({locacoes.length})
          </button>
          <button onClick={() => setAbaAtiva('financeiro')} className={`py-2 px-6 font-semibold text-sm border-b-2 whitespace-nowrap ${abaAtiva === 'financeiro' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`}>
            💰 Financeiro & Relatórios
          </button>
        </div>

        <div className="space-y-6">
          {abaAtiva === 'equipamentos' && (
            <div className="space-y-6">
              <div className="no-print bg-white shadow rounded-lg p-6 border border-gray-100">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Cadastrar Novo Equipamento</h2>
                <form onSubmit={handleCadastrarEq} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Nome / Apelido</label><input type="text" placeholder="Ex: Laser Hakon 01" value={nomeEq} onChange={(e) => setNomeEq(e.target.value)} className="w-full border rounded-md p-2 text-sm text-gray-800" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Marca / Modelo</label><input type="text" placeholder="Ex: Hakon" value={marcaEq} onChange={(e) => setMarcaEq(e.target.value)} className="w-full border rounded-md p-2 text-sm text-gray-800" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Número de Série</label><input type="text" placeholder="Ex: HK-9988" value={serieEq} onChange={(e) => setSerieEq(e.target.value)} className="w-full border rounded-md p-2 text-sm text-gray-800" /></div>
                  <button type="submit" disabled={salvandoEq} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md text-sm">Cadastrar</button>
                </form>
              </div>
              <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-700">Equipamentos Cadastrados</h2>
                  <button onClick={() => window.print()} className="no-print bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded text-xs font-bold hover:bg-indigo-100">
                    🖨️ Imprimir Lista
                  </button>
                </div>
                {loadingEq ? <p>Carregando...</p> : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {equipamentos.map((eq) => (
                      <div key={eq.id} className="border p-4 rounded-lg bg-gray-50 flex justify-between">
                        <div>
                          <h3 className="font-bold text-lg text-indigo-600">{eq.nome}</h3>
                          <p className="text-sm text-gray-600">Marca: <strong>{eq.marca}</strong> | Série: <strong>{eq.numero_serie}</strong></p>
                        </div>
                        <button onClick={() => handleExcluirEq(eq.id)} className="no-print text-xs text-red-600 border border-red-200 px-2 py-1 rounded h-fit">Excluir</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {abaAtiva === 'clientes' && (
            <div className="space-y-6">
              <div className="no-print bg-white shadow rounded-lg p-6 border border-gray-100">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">{editandoCliId ? 'Editar Cliente' : 'Novo Cliente'}</h2>
                <form onSubmit={handleSalvarCliente} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Nome da Clínica</label><input type="text" value={nomeClinica} onChange={(e) => setNomeClinica(e.target.value)} className="w-full border rounded-md p-2 text-sm text-gray-800" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Contato</label><input type="text" value={nomeContato} onChange={(e) => setNomeContato(e.target.value)} className="w-full border rounded-md p-2 text-sm text-gray-800" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label><input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="w-full border rounded-md p-2 text-sm text-gray-800" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">CEP</label><input type="text" value={cep} onChange={(e) => setCep(e.target.value)} onBlur={handleCepBlur} className="w-full border rounded-md p-2 text-sm text-gray-800" /></div>
                  <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Rua</label><input type="text" value={rua} onChange={(e) => setRua(e.target.value)} className="w-full border rounded-md p-2 text-sm text-gray-800 bg-gray-50" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Número</label><input type="text" value={numero} onChange={(e) => setNumero(e.target.value)} className="w-full border rounded-md p-2 text-sm text-gray-800" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label><input type="text" value={bairro} onChange={(e) => setBairro(e.target.value)} className="w-full border rounded-md p-2 text-sm text-gray-800 bg-gray-50" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label><input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} className="w-full border rounded-md p-2 text-sm text-gray-800 bg-gray-50" /></div>
                  <div className="md:col-span-3 flex justify-end">
                    <button type="submit" className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-md text-sm">{editandoCliId ? 'Salvar Alterações' : 'Cadastrar'}</button>
                  </div>
                </form>
              </div>
              <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-700">Relatório de Clientes / Clínicas Cadastradas</h2>
                  <button onClick={() => window.print()} className="no-print bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded text-xs font-bold hover:bg-indigo-100">
                    🖨️ Imprimir Lista de Clientes
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {clientes.map((cli) => (
                    <div key={cli.id} className="border p-4 rounded-lg bg-gray-50 flex justify-between">
                      <div>
                        <h3 className="font-bold text-indigo-600">{cli.nome_clinica} ({cli.codigo})</h3>
                        <p className="text-xs text-gray-600">Contato: <strong>{cli.nome_contato || 'N/D'}</strong> | Tel: <strong>{cli.telefone || 'N/D'}</strong></p>
                        <p className="text-xs text-gray-500 mt-1">{cli.rua}, {cli.numero} - {cli.bairro} | {cli.cidade}</p>
                      </div>
                      <div className="no-print flex gap-2">
                        <button onClick={() => handleEditarCliente(cli)} className="text-xs text-indigo-600 border border-indigo-200 px-2 py-1 rounded h-fit">Editar</button>
                        <button onClick={() => handleExcluirCli(cli.id)} className="text-xs text-red-600 border border-red-200 px-2 py-1 rounded h-fit">Excluir</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {abaAtiva === 'locacoes' && (
            <div className="space-y-6">
              <div className="no-print bg-white shadow rounded-lg p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-700">
                    {editandoLocId ? `Editando Locação #${editandoLocId}` : 'Nova Locação / Agendamento'}
                  </h2>
                  {editandoLocId && (
                    <button 
                      onClick={limparFormularioLocacao}
                      className="text-xs bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1 rounded font-bold hover:bg-rose-200"
                    >
                      Cancelar Edição
                    </button>
                  )}
                </div>

             <form onSubmit={handleCadastrarLocacao} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cliente / Clínica</label>
                      <select value={cliLocacaoId} onChange={(e) => { setCliLocacaoId(e.target.value); handleClienteOuEquipamentoChange(e.target.value, eqLocacaoId) }} className="w-full border rounded-md p-2 text-sm bg-white">
                        <option value="">Selecione...</option>
                        {clientes.map(c => <option key={c.id} value={c.id}>{c.codigo} - {c.nome_clinica} ({c.cidade})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Equipamento</label>
                      <select value={eqLocacaoId} onChange={(e) => { setEqLocacaoId(e.target.value); handleClienteOuEquipamentoChange(cliLocacaoId, e.target.value) }} className="w-full border rounded-md p-2 text-sm bg-white">
                        <option value="">Selecione...</option>
                        {equipamentos.map(eq => <option key={eq.id} value={eq.id}>{eq.nome} ({eq.marca})</option>)}
                      </select>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Data da Locação</label><input type="date" value={dataLocacao} onChange={(e) => setDataLocacao(e.target.value)} className="w-full border rounded-md p-2 text-sm" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Última Data Locada</label><input type="date" value={ultimaDataLocada} disabled className="w-full border rounded-md p-2 text-sm bg-gray-50" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Valor Última Locação (R$)</label><input type="number" value={valorUltimaLocacao} disabled className="w-full border rounded-md p-2 text-sm bg-gray-50" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Valor Atual (R$)</label><input type="number" step="0.01" value={valorAtual} onChange={(e) => setValorAtual(e.target.value)} className="w-full border rounded-md p-2 text-sm" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Próxima Locação</label><input type="date" value={proximaLocacao} onChange={(e) => setProximaLocacao(e.target.value)} className="w-full border rounded-md p-2 text-sm" /></div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tempo / Horas de Locação</label>
                      <input 
                        type="text" 
                        placeholder="Ex: 8 horas, 50 disparos..." 
                        value={tempoLocacao} 
                        onChange={(e) => setTempoLocacao(e.target.value)} 
                        className="w-full border rounded-md p-2 text-sm" 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Forma de Pagamento</label>
                      <select value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value)} className="w-full border rounded-md p-2 text-sm bg-white">
                        <option value="Pix">Pix</option>
                        <option value="Dinheiro">Dinheiro</option>
                        <option value="Débito">Débito</option>
                        <option value="Pix + Dinheiro">Pix + Dinheiro</option>
                        <option value="Pix + Débito">Pix + Débito</option>
                      </select>
                    </div>

                    {isPagamentoDuplo && (
                      <>
                        <div><label className="block text-xs font-semibold text-indigo-900 mb-1">Valor em {partesFormaPag[0]}</label><input type="number" step="0.01" value={valorPagamento1} onChange={(e) => setValorPagamento1(e.target.value)} className="w-full border rounded-md p-2 text-sm" /></div>
                        <div><label className="block text-xs font-semibold text-indigo-900 mb-1">Valor em {partesFormaPag[1]}</label><input type="number" step="0.01" value={valorPagamento2} onChange={(e) => setValorPagamento2(e.target.value)} className="w-full border rounded-md p-2 text-sm" /></div>
                      </>
                    )}

                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Observação (Acessórios, horários ou detalhes operacionais)</label>
                      <textarea 
                        rows={2} 
                        placeholder="Insira observações relevantes sobre esta locação..." 
                        value={observacaoLoc} 
                        onChange={(e) => setObservacaoLoc(e.target.value)} 
                        className="w-full border rounded-md p-2 text-sm" 
                      />
                    </div>
                  </div>

                  {isForaDeMaringa && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-3">
                      <h3 className="text-sm font-bold text-amber-800">🚗 Custo Operacional Viagem Externa ({clienteSelecionado?.cidade})</h3>
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                        <div>
                          <label className="text-xs font-semibold">Combustível</label>
                          <select value={tipoCombustivel} onChange={(e) => setTipoCombustivel(e.target.value)} className="w-full border p-1.5 text-sm bg-white">
                            <option value="Gasolina">Gasolina</option>
                            <option value="Álcool">Álcool</option>
                          </select>
                        </div>
                        <div><label className="text-xs">KM Rodados</label><input type="number" value={kmRodados} onChange={(e) => setKmRodados(e.target.value)} className="w-full border p-1.5 text-sm bg-white" /></div>
                        <div><label className="text-xs">Preço Litro</label><input type="number" step="0.01" value={precoCombustivel} onChange={(e) => setPrecoCombustivel(e.target.value)} className="w-full border p-1.5 text-sm bg-white" /></div>
                        <div><label className="text-xs">Pedágio</label><input type="number" step="0.01" value={valorPedagio} onChange={(e) => setValorPedagio(e.target.value)} className="w-full border p-1.5 text-sm bg-white" /></div>
                        <div><label className="text-xs">Refeição</label><input type="number" step="0.01" value={valorRefeicao} onChange={(e) => setValorRefeicao(e.target.value)} className="w-full border p-1.5 text-sm bg-white" /></div>
                        <div><label className="text-xs">Hospedagem</label><input type="number" step="0.01" value={valorHospedagem} onChange={(e) => setValorHospedagem(e.target.value)} className="w-full border p-1.5 text-sm bg-white" /></div>
                        <div className="md:col-span-6 flex flex-col justify-end bg-amber-100 p-2 rounded mt-2">
                          <span className="text-xs font-bold text-amber-900">Total Operacional calculado (gerará Saída automática): {formatarMoeda(custoTotalOperacional)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <button type="submit" disabled={salvandoLoc} className={`w-full text-white font-semibold py-2 px-8 rounded-md text-sm ${editandoLocId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                    {editandoLocId ? 'Atualizar Locação' : 'Agendar Locação (Pagamento Pendente)'}
                  </button>
                </form>

              <div className="space-y-6">
                <div className="no-print bg-indigo-50 border border-indigo-200 rounded-lg p-4 flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-indigo-900 mb-1">Data Início</label>
                    <input type="date" value={filtroLocDataInicio} onChange={(e) => setFiltroLocDataInicio(e.target.value)} className="w-full border rounded p-2 text-sm bg-white" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-indigo-900 mb-1">Data Fim</label>
                    <input type="date" value={filtroLocDataFim} onChange={(e) => setFiltroLocDataFim(e.target.value)} className="w-full border rounded p-2 text-sm bg-white" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-indigo-900 mb-1">Filtrar Equipamento</label>
                    <select value={filtroLocEq} onChange={(e) => setFiltroLocEq(e.target.value)} className="w-full border rounded p-2 text-sm bg-white">
                      <option value="">Todos os Equipamentos</option>
                      {equipamentos.map(eq => <option key={eq.id} value={eq.id}>{eq.nome}</option>)}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-indigo-900 mb-1">Filtrar Clínica / Cliente</label>
                    <select value={filtroLocCli} onChange={(e) => setFiltroLocCli(e.target.value)} className="w-full border rounded p-2 text-sm bg-white">
                      <option value="">Todas as Clínicas</option>
                      {clientes.map(c => <option key={c.id} value={c.id}>{c.nome_clinica}</option>)}
                    </select>
                  </div>
                  <div className="flex items-end">
                    {(filtroLocDataInicio || filtroLocDataFim || filtroLocEq || filtroLocCli) && (
                      <button onClick={() => { setFiltroLocDataInicio(''); setFiltroLocDataFim(''); setFiltroLocEq(''); setFiltroLocCli('') }} className="text-xs text-red-600 underline font-semibold p-2 mb-1 hover:text-red-800">
                        Limpar Filtros
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">Relatório de Locações por Equipamento</h2>
                  <button onClick={() => window.print()} className="no-print bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded text-xs font-bold hover:bg-indigo-100">
                    🖨️ Imprimir Relatório de Locações
                  </button>
                </div>

                {loadingLoc ? <p>Carregando...</p> : locacoesPorEquipamento.map((grupo) => (
                  <div key={grupo.equipamento.id} className="bg-white shadow rounded-lg p-6 border border-gray-200 space-y-4">
                    <div className="flex justify-between items-center border-b pb-3">
                      <h3 className="text-lg font-bold text-indigo-700 flex items-center gap-2">
                        ⚡ Equipamento: {grupo.equipamento.nome} ({grupo.equipamento.marca})
                      </h3>
                      <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {grupo.locacoes.length} registro(s)
                      </span>
                    </div>

                    {grupo.locacoes.length === 0 ? (
                      <p className="text-sm text-gray-500 italic py-2">Nenhuma locação registrada para este equipamento.</p>
                    ) : (
                      <div className="space-y-4">
                        {grupo.locacoes.map((loc) => (
                          <div key={loc.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm relative space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-bold text-gray-900 text-base">{loc.clientes?.nome_clinica || 'Clínica não informada'}</h4>
                                <p className="text-xs text-gray-600">Contato: <span className="font-medium text-gray-800">{loc.clientes?.nome_contato || '-'}</span></p>
                                <p className="text-xs text-indigo-600 font-medium">Cidade: {loc.clientes?.cidade || '-'}</p>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-1 rounded font-semibold">
                                  Pagto: {loc.forma_pagamento}
                                </span>
                                {loc.status_pagamento === 'Pago' ? (
                                  <span className="bg-green-100 text-green-800 border border-green-200 text-xs px-2.5 py-1 rounded font-semibold">
                                    ✅ Pago
                                  </span>
                                ) : (
                                  <button 
                                    onClick={() => handleConfirmarPagamento(loc)}
                                    className="no-print bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded shadow-sm text-xs font-bold transition"
                                  >
                                    💰 Confirmar Pagamento
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-3 rounded-md text-xs">
                              <div>
                                <span className="text-gray-500 block">Data Locação:</span>
                                <strong className="text-gray-800 text-sm">{loc.data_locacao ? new Date(loc.data_locacao + 'T00:00:00').toLocaleDateString('pt-BR') : '-'}</strong>
                              </div>
                              {/* NOVO: Exibição do Tempo */}
                              <div>
                                <span className="text-gray-500 block">Tempo / Horas:</span>
                                <strong className="text-gray-800 text-sm">{loc.tempo_locacao || '-'}</strong>
                              </div>
                              <div>
                                <span className="text-gray-500 block">Valor Atual:</span>
                                <strong className="text-indigo-700 text-sm">{formatarMoeda(loc.valor_atual)}</strong>
                              </div>
                              <div>
                                <span className="text-gray-500 block">Última Locação:</span>
                                <strong className="text-gray-800 text-sm">{loc.ultima_data_locada ? new Date(loc.ultima_data_locada + 'T00:00:00').toLocaleDateString('pt-BR') : '-'}</strong>
                              </div>
                            </div>

                            {/* NOVO: Exibição da Observação */}
                            {loc.observacao && (
                              <div className="bg-blue-50 border border-blue-200 p-2.5 rounded text-xs text-blue-900">
                                <span className="font-bold">📝 Observação:</span> {loc.observacao}
                              </div>
                            )}

                            {loc.custo_total_operacional && loc.custo_total_operacional > 0 ? (
                              <div className="bg-amber-50 border border-amber-200 p-3 rounded text-xs text-amber-900 space-y-1">
                                <p className="font-bold flex items-center gap-1">
                                  📊 Custo Operacional Viagem: {formatarMoeda(loc.custo_total_operacional)}
                                </p>
                                <p className="text-amber-800 mt-1">
                                  {loc.km_rodados ? `${loc.km_rodados}km` : ''} 
                                  {loc.tipo_combustivel ? ` (${loc.tipo_combustivel})` : ''} 
                                  {loc.custo_combustivel ? ` | Combustível: ${formatarMoeda(loc.custo_combustivel)}` : ''}
                                  {loc.valor_pedagio ? ` | Pedágio: ${formatarMoeda(loc.valor_pedagio)}` : ''}
                                  {loc.valor_refeicao ? ` | Refeição: ${formatarMoeda(loc.valor_refeicao)}` : ''}
                                  {loc.valor_hospedagem ? ` | Hospedagem: ${formatarMoeda(loc.valor_hospedagem)}` : ''}
                                </p>
                              </div>
                            ) : null}

                            <div className="flex flex-wrap justify-between items-center pt-2 text-xs text-gray-600 border-t border-gray-100">
                              <div className="space-y-0.5">
                                {loc.dias_entre_locacoes && (
                                  <p className="flex items-center gap-1">⏱️ Dias entre as locações: <strong className="text-gray-800">{loc.dias_entre_locacoes} dias</strong></p>
                                )}
                                {loc.proxima_locacao && (
                                  <p className="flex items-center gap-1">📅 Próxima Locação Agendada: <strong className="text-indigo-700">{new Date(loc.proxima_locacao + 'T00:00:00').toLocaleDateString('pt-BR')}</strong></p>
                                )}
                              </div>
                              
                              <div className="no-print flex gap-2">
                                {/* NOVO: Botão Editar */}
                                <button
                                  onClick={() => handleEditarLocacao(loc)}
                                  className="text-amber-700 border border-amber-300 hover:bg-amber-50 px-3 py-1.5 rounded font-semibold transition"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleExcluirLocacao(loc.id)}
                                  className="text-red-600 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded font-semibold transition"
                                >
                                  Excluir Registro
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {abaAtiva === 'financeiro' && (
            <div className="space-y-6">
              <div className="no-print bg-indigo-50 border border-indigo-200 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-indigo-900">📅 Filtrar Relatório por Período:</span>
                </div>
                <div className="flex items-center gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Data Início</label>
                    <input type="date" value={dataInicioRel} onChange={(e) => setDataInicioRel(e.target.value)} className="border rounded p-1.5 text-sm bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Data Fim</label>
                    <input type="date" value={dataFimRel} onChange={(e) => setDataFimRel(e.target.value)} className="border rounded p-1.5 text-sm bg-white" />
                  </div>
                  {(dataInicioRel || dataFimRel) && (
                    <button onClick={() => { setDataInicioRel(''); setDataFimRel('') }} className="mt-5 text-xs text-red-600 underline font-semibold">
                      Limpar Filtro
                    </button>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Relatório Consolidado do Financeiro</h2>
                <button onClick={() => window.print()} className="no-print bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded text-xs font-bold hover:bg-indigo-100">
                  🖨️ Imprimir Relatório Financeiro Completo
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 p-5 rounded-lg shadow-sm">
                  <p className="text-xs font-semibold text-green-700 uppercase">Total Entradas (Receitas)</p>
                  <p className="text-2xl font-bold text-green-800 mt-1">{formatarMoeda(totalEntradas)}</p>
                </div>
                <div className="bg-red-50 border border-red-200 p-5 rounded-lg shadow-sm">
                  <p className="text-xs font-semibold text-red-700 uppercase">Total Saídas (Despesas)</p>
                  <p className="text-2xl font-bold text-red-800 mt-1">{formatarMoeda(totalSaidas)}</p>
                </div>
                <div className={`p-5 rounded-lg shadow-sm border ${saldoLiquido >= 0 ? 'bg-indigo-50 border-indigo-200 text-indigo-900' : 'bg-orange-50 border-orange-200 text-orange-900'}`}>
                  <p className="text-xs font-semibold uppercase opacity-80">Saldo Líquido do Período</p>
                  <p className="text-2xl font-bold mt-1">{formatarMoeda(saldoLiquido)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">📈 Relatório de Saídas por Categoria</h3>
                  {Object.keys(resumoSaidasPorCategoria).length === 0 ? (
                    <p className="text-xs text-gray-500 italic">Nenhuma saída registrada no período.</p>
                  ) : (
                    <div className="space-y-2">
                      {Object.entries(resumoSaidasPorCategoria).map(([cat, val]: [string, any]) => (
                        <div key={cat} className="flex justify-between items-center text-sm border-b border-gray-50 py-1.5">
                          <span className="text-gray-700 font-medium">{cat}</span>
                          <strong className="text-red-600">{formatarMoeda(val)}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">📊 Relatório de Entradas por Categoria</h3>
                  {Object.keys(resumoEntradasPorCategoria).length === 0 ? (
                    <p className="text-xs text-gray-500 italic">Nenhuma entrada manual registrada no período.</p>
                  ) : (
                    <div className="space-y-2">
                      {Object.entries(resumoEntradasPorCategoria).map(([cat, val]: [string, any]) => (
                        <div key={cat} className="flex justify-between items-center text-sm border-b border-gray-50 py-1.5">
                          <span className="text-gray-700 font-medium">{cat}</span>
                          <strong className="text-green-600">{formatarMoeda(val)}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="no-print bg-white shadow rounded-lg p-6 border border-gray-100 space-y-4">
                <h2 className="text-xl font-semibold text-gray-700">Novo Lançamento Financeiro (Manual)</h2>
                <form onSubmit={handleSalvarFinanceiro} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Transação</label>
                      <select value={tipoTransacao} onChange={(e) => setTipoTransacao(e.target.value)} className="w-full border rounded-md p-2 text-sm bg-white">
                        <option value="Entrada">Entrada (Crédito Manual)</option>
                        <option value="Saida">Saída (Débito / Despesa)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                      <select value={categoriaFin} onChange={(e) => setCategoriaFin(e.target.value)} className="w-full border rounded-md p-2 text-sm bg-white">
                        <option value="Outros">Outros</option>
                        <option value="Manutenção">Manutenção de Equipamento</option>
                        <option value="Custo Viagem / Operacional">Custo Viagem / Operacional</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Combustível">Combustível</option>
                        <option value="Alimentação">Alimentação</option>
                        <option value="Retirada Pró-Labore">Retirada Pró-Labore</option>
                        <option value="Retirada Pró-Labore Osvino">Retirada Pró-Labore Osvino</option>
                        <option value="Aluguel">Aluguel</option>
                        <option value="Prestação Equipamento">Prestação Equipamento</option>
                        <option value="Fundo de Reserva">Fundo de Reserva</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                      <input type="date" value={dataFin} onChange={(e) => setDataFin(e.target.value)} className="w-full border rounded-md p-2 text-sm bg-white" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                      <input type="text" placeholder="Ex: Pagamento referente ao aluguel do mês" value={descricaoFin} onChange={(e) => setDescricaoFin(e.target.value)} className="w-full border rounded-md p-2 text-sm bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                      <input type="number" step="0.01" placeholder="Ex: 150.00" value={valorFin} onChange={(e) => setValorFin(e.target.value)} className="w-full border rounded-md p-2 text-sm bg-white" />
                    </div>
                  </div>

                  <button type="submit" disabled={salvandoFin} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-md text-sm">Adicionar Lançamento Manual</button>
                </form>
              </div>

              <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Extrato de Transações (Filtrado)</h2>
                {loadingFin ? <p>Carregando...</p> : transacoesFiltradas.length === 0 ? <p className="text-gray-500">Nenhum lançamento financeiro encontrado no período.</p> : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50 text-gray-600">
                          <th className="p-3">Data</th>
                          <th className="p-3">Tipo</th>
                          <th className="p-3">Categoria</th>
                          <th className="p-3">Descrição</th>
                          <th className="p-3">Valor</th>
                          <th className="no-print p-3 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transacoesFiltradas.map((t) => (
                          <tr key={t.id} className="border-b hover:bg-gray-50">
                            <td className="p-3">{new Date(t.data_transacao + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${t.tipo === 'Entrada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {t.tipo}
                              </span>
                            </td>
                            <td className="p-3">{t.categoria}</td>
                            <td className="p-3 font-medium text-gray-800">{t.descricao}</td>
                            <td className={`p-3 font-bold ${t.tipo === 'Entrada' ? 'text-green-600' : 'text-red-600'}`}>
                              {t.tipo === 'Entrada' ? '+' : '-'} {formatarMoeda(t.valor)}
                            </td>
                            <td className="no-print p-3 text-right">
                              <button onClick={() => handleExcluirTransacao(t.id)} className="text-xs text-red-600 border border-red-200 px-2 py-1 rounded">Excluir</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}