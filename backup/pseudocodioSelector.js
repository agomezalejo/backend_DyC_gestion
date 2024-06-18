import React from 'react'

export default function Saldo() {
  const [Grupos, setGrupos] = useState(second)
  const [GrupoSeleccionado, setGrupoSeleccionado] = useState(null)
  const [Integrantes, setIntegrantes] = useState(null)
  const [Integrante, setIntegrante] = useState(null)
  const [Monto, setMonto] = useState(0)
  const [IntegrantesPagos, setIntegrantesPagos] = useState([])

  const TraerGrupos= async() => {
    let grupos = await getMisGrupos()
    setGrupos(grupos)
  }

  const seleccionarGrupo = (grupo) => {
    setGrupoSeleccionado(grupo)
    setIntegrantes(grupo.usuarios)
  }

  const seleccionarIntegrante = (integrante) => {
    setIntegrante(integrante)
  }

  const setearPagado = (monto) => {
    setMonto(monto)
  }

  const agregarPago = () => {
    let indx = IntegrantesPagos.findIndex(integrante => integrante.id === Integrante.id) 
    if(indx !== -1){
      IntegrantesPagos[indx].monto_pagado = Monto
    }else{
      setIntegrantesPagos([...IntegrantesPagos, 
        {
          id: Integrante.id, 
          monto_pagado: Monto,
          metodo_pago: "Efectivo"
        }
      ])  
    }
  }


  useEffect(() => {
    TraerGrupos()
  }, [])
  

  return (
    <>
      <div /*buclea Grupos*/  onSelect={seleccionarGrupo}>Selector grupo</div>
      {GrupoSeleccionado && Integrantes ? 
        <>
          <div /*buclea Integrantes*/  onSelect={seleccionarIntegrante}>Selector integrante</div>
          <div /*Input Monto pagado*/ onChange={setearPagado}/>
          <button /*Agregar pago*/ onClick={agregarPago}>Agregar pago</button>
        </> 
        : 
        <></> 
      }
    </>
    
  )
}
