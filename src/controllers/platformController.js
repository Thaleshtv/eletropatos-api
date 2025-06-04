const {
  getAllServices,
  updateStatusCity,
  updateStatusService,
  updateTimeCity,
  updateStatusAllCities,
  updateStatusEmergencyCity,
  updateTimeEmergencyCity,
  toggleNeighborhoodStatus,
  createNeighborhood,
  createZone,
  toggleZoneStatus,
  createHoliday,
  deleteHoliday,
  addBlockedService,
  removeBlockedService
} = require('../services/platformServices')

const createNewZone = async (req, res) => {
  try {
    const { plataforma, cityName, zoneName, isActive } = req.body

    // Validação dos parâmetros (isActive é opcional, padrão true)
    if (!plataforma || !cityName || !zoneName) {
      return res.status(400).json({
        message:
          'Parâmetros inválidos. Certifique-se de enviar: plataforma (string), cityName (string) e zoneName (string).'
      })
    }

    // Se isActive não foi enviado, assume true
    const activeStatus = typeof isActive === 'boolean' ? isActive : true

    const newZone = await createZone(
      plataforma,
      cityName,
      zoneName,
      activeStatus
    )

    res.status(201).json({
      message: `Zona criada com sucesso (${
        activeStatus ? 'ativa' : 'inativa'
      })`,
      newZone
    })
  } catch (err) {
    console.error('Erro ao criar zona:', err)

    // Tratamento de erros específicos
    if (
      err.message.includes('Plataforma') ||
      err.message.includes('Cidade') ||
      err.message.includes('já existe')
    ) {
      return res.status(400).json({ message: err.message })
    }

    res.status(500).json({
      message: 'Erro interno do servidor',
      error: err.message
    })
  }
}

const handleToggleZoneStatus = async (req, res) => {
  try {
    const { plataforma, cityName, zoneName, activeStatus } = req.body

    // Validação dos parâmetros
    if (
      !plataforma ||
      !cityName ||
      !zoneName ||
      typeof activeStatus !== 'boolean'
    ) {
      return res.status(400).json({
        message:
          'Parâmetros inválidos. Certifique-se de enviar: plataforma (string), cityName (string), zoneName (string) e activeStatus (boolean).'
      })
    }

    const updatedZone = await toggleZoneStatus(
      plataforma,
      cityName,
      zoneName,
      activeStatus
    )

    res.status(200).json({
      message: activeStatus
        ? 'Zona ativada com sucesso'
        : 'Zona desativada com sucesso',
      updatedZone
    })
  } catch (err) {
    console.error('Erro ao alterar status da zona:', err)

    // Tratamento de erros específicos
    if (
      err.message.includes('Plataforma') ||
      err.message.includes('Cidade') ||
      err.message.includes('Zona') ||
      err.message.includes('Nenhuma zona encontrada')
    ) {
      return res.status(404).json({ message: err.message })
    }

    res.status(500).json({
      message: 'Erro interno do servidor',
      error: err.message
    })
  }
}

const createNewNeighborhood = async (req, res) => {
  try {
    const { plataforma, cityName, neighborhoodName, isActive } = req.body

    // Validação dos parâmetros (isActive é opcional, padrão true)
    if (!plataforma || !cityName || !neighborhoodName) {
      return res.status(400).json({
        message:
          'Parâmetros inválidos. Certifique-se de enviar: plataforma (string), cityName (string) e neighborhoodName (string).'
      })
    }

    // Se isActive não foi enviado, assume true
    const activeStatus = typeof isActive === 'boolean' ? isActive : true

    const newNeighborhood = await createNeighborhood(
      plataforma,
      cityName,
      neighborhoodName,
      activeStatus
    )

    res.status(201).json({
      message: `Bairro criado com sucesso (${
        activeStatus ? 'ativo' : 'inativo'
      })`,
      newNeighborhood
    })
  } catch (err) {
    console.error('Erro ao criar bairro:', err)

    // Tratamento de erros específicos
    if (
      err.message.includes('Plataforma') ||
      err.message.includes('Cidade') ||
      err.message.includes('já existe')
    ) {
      return res.status(400).json({ message: err.message })
    }

    res.status(500).json({
      message: 'Erro interno do servidor',
      error: err.message
    })
  }
}

const handleToggleNeighborhoodStatus = async (req, res) => {
  try {
    const { plataforma, cityName, neighborhoodName, activeStatus } = req.body

    // Validação dos parâmetros
    if (
      !plataforma ||
      !cityName ||
      !neighborhoodName ||
      typeof activeStatus !== 'boolean'
    ) {
      return res.status(400).json({
        message:
          'Parâmetros inválidos. Certifique-se de enviar: plataforma (string), cityName (string), neighborhoodName (string) e activeStatus (boolean).'
      })
    }

    const updatedNeighborhood = await toggleNeighborhoodStatus(
      plataforma,
      cityName,
      neighborhoodName,
      activeStatus
    )

    res.status(200).json({
      message: activeStatus
        ? 'Bairro ativado com sucesso'
        : 'Bairro desativado com sucesso',
      updatedNeighborhood
    })
  } catch (err) {
    console.error('Erro ao alterar status do bairro:', err)

    // Tratamento de erros específicos
    if (
      err.message.includes('Plataforma') ||
      err.message.includes('Cidade') ||
      err.message.includes('Bairro')
    ) {
      return res.status(404).json({ message: err.message })
    }

    res.status(500).json({
      message: 'Erro interno do servidor',
      error: err.message
    })
  }
}

const getServices = async (req, res) => {
  try {
    const services = await getAllServices()

    if (!services || services.length === 0) {
      return res.status(404).json({ message: 'Nenhum serviço encontrado' })
    }

    const reorganizedServices = services.map((service) => ({
      plataforma: service.plataforma,
      cities: service.cities,
      services: service.services,
      feriados: service.feriados,
      servicos_bloqueados: service.servicos_bloqueados
    }))

    res.status(200).json(reorganizedServices)
  } catch (err) {
    console.error('Erro ao buscar serviços:', err)
    res
      .status(500)
      .json({ message: 'Erro interno do servidor', error: err.message })
  }
}

const handleUpdateTimeCity = async (req, res) => {
  try {
    const { plataforma, cityName, value, field } = req.body

    if (!plataforma || !cityName || !value || !field) {
      return res.status(400).json({
        message:
          'Parâmetros inválidos. Certifique-se de enviar: plataforma (string), cityName (string), value (number) e field (string).'
      })
    }

    const updatedCity = await updateTimeCity(plataforma, cityName, value, field)

    res.status(200).json({
      message: 'Tempo atualizado com sucesso',
      updatedCity
    })
  } catch (err) {
    console.error('Erro ao atualizar tempo da cidade:', err)

    if (err.message.includes('Plataforma') || err.message.includes('Cidade')) {
      return res.status(404).json({ message: err.message })
    }

    res.status(500).json({
      message: 'Erro interno do servidor',
      error: err.message
    })
  }
}

const handleUpdateTimeEmergencyCity = async (req, res) => {
  try {
    const { plataforma, cityName, value, field } = req.body

    if (!plataforma || !cityName || !value || !field) {
      return res.status(400).json({
        message:
          'Parâmetros inválidos. Certifique-se de enviar: plataforma (string), cityName (string), value (number) e field (string).'
      })
    }

    const updatedCity = await updateTimeEmergencyCity(
      plataforma,
      cityName,
      value,
      field
    )

    res.status(200).json({
      message: 'Tempo atualizado com sucesso',
      updatedCity
    })
  } catch (err) {
    console.error('Erro ao atualizar tempo da cidade:', err)

    if (err.message.includes('Plataforma') || err.message.includes('Cidade')) {
      return res.status(404).json({ message: err.message })
    }

    res.status(500).json({
      message: 'Erro interno do servidor',
      error: err.message
    })
  }
}

const updateCityStatus = async (req, res) => {
  try {
    const { plataforma, cityName, value } = req.body

    if (!plataforma || !cityName || typeof value !== 'boolean') {
      return res.status(400).json({
        message:
          'Parâmetros inválidos. Certifique-se de enviar: plataforma (string), cityName (string) e value (boolean).'
      })
    }

    const updatedCity = await updateStatusCity(plataforma, cityName, value)

    res.status(200).json({
      message: 'Status atualizado com sucesso',
      updatedCity
    })
  } catch (err) {
    console.error('Erro ao atualizar status da cidade:', err)

    if (err.message.includes('Plataforma') || err.message.includes('Cidade')) {
      return res.status(404).json({ message: err.message })
    }

    res.status(500).json({
      message: 'Erro interno do servidor',
      error: err.message
    })
  }
}

const updateCityEmergencyStatus = async (req, res) => {
  try {
    const { plataforma, cityName, value } = req.body

    if (!plataforma || !cityName || typeof value !== 'boolean') {
      return res.status(400).json({
        message:
          'Parâmetros inválidos. Certifique-se de enviar: plataforma (string), cityName (string) e value (boolean).'
      })
    }

    const updatedCity = await updateStatusEmergencyCity(
      plataforma,
      cityName,
      value
    )

    res.status(200).json({
      message: 'Status atualizado com sucesso',
      updatedCity
    })
  } catch (err) {
    if (err.message.includes('Plataforma') || err.message.includes('Cidade')) {
      return res.status(404).json({ message: err.message })
    }

    res.status(500).json({
      message: 'Erro interno do servidor',
      error: err.message
    })
  }
}

const updateServiceStatus = async (req, res) => {
  try {
    const { plataforma, serviceName, value } = req.body

    if (!plataforma || !serviceName || typeof value !== 'boolean') {
      return res.status(400).json({
        message:
          'Parâmetros inválidos. Certifique-se de enviar: plataforma (string), serviceName (string) e value (boolean).'
      })
    }

    const updatedService = await updateStatusService(
      plataforma,
      serviceName,
      value
    )

    res.status(200).json({
      message: 'Status atualizado com sucesso',
      updatedService
    })
  } catch (err) {
    console.error('Erro ao atualizar status do serviço:', err)

    if (err.message.includes('Plataforma') || err.message.includes('Serviço')) {
      return res.status(404).json({ message: err.message })
    }

    res.status(500).json({
      message: 'Erro interno do servidor',
      error: err.message
    })
  }
}

const handleUpdateStatusAllCities = async (req, res) => {
  try {
    const { plataforma, value } = req.body

    if (!plataforma || typeof value !== 'boolean') {
      return res.status(400).json({
        message:
          'Parâmetros inválidos. Certifique-se de enviar: plataforma (string) e value (boolean).'
      })
    }

    const updatedCities = await updateStatusAllCities(plataforma, value)

    res.status(200).json({
      message: 'Status de todas as cidades atualizado com sucesso',
      updatedCities
    })
  } catch (err) {
    console.error('Erro ao atualizar status de todas as cidades:', err)

    if (err.message.includes('Plataforma')) {
      return res.status(404).json({ message: err.message })
    }

    res.status(500).json({
      message: 'Erro interno do servidor',
      error: err.message
    })
  }
}

const handleCreateHoliday = async (req, res) => {
  try {
    const { plataforma, holidayName, holidayDate } = req.body

    if (!plataforma || !holidayName || !holidayDate) {
      return res.status(400).json({
        message:
          'Parâmetros inválidos. Certifique-se de enviar: plataforma (string), cityName (string), holidayName (string) e holidayDate (date).'
      })
    }

    const newHoliday = await createHoliday(plataforma, holidayName, holidayDate)

    res.status(201).json({
      message: 'Feriado criado com sucesso',
      newHoliday
    })
  } catch (err) {
    console.error('Erro ao criar feriado:', err)

    res.status(500).json({
      message: 'Erro interno do servidor',
      error: err.message
    })
  }
}

const handleDeleteHoliday = async (req, res) => {
  try {
    const { plataforma, holidayName, holidayDate } = req.body

    if (!plataforma || !holidayName || !holidayDate) {
      return res.status(400).json({
        message: 'Parâmetros inválidos ou faltando'
      })
    }

    const deletedHoliday = await deleteHoliday(
      plataforma,
      holidayName,
      holidayDate
    )

    res.status(200).json({
      message: 'Feriado deletado com sucesso',
      deletedHoliday
    })
  } catch (err) {
    console.error('Erro ao deletar feriado:', err)

    res.status(500).json({
      message: 'Erro interno do servidor',
      error: err.message
    })
  }
}

const handleAddBlockedService = async (req, res) => {
  try {
    const { plataforma, serviceNumber } = req.body

    if (!plataforma || !serviceNumber) {
      return res.status(400).json({
        message:
          'Parâmetros inválidos. Certifique-se de enviar: plataforma (string) e serviceNumber (string).'
      })
    }

    const updatedPlatform = await addBlockedService(plataforma, serviceNumber)

    res.status(201).json({
      message: 'Serviço bloqueado adicionado com sucesso',
      updatedPlatform
    })
  } catch (err) {
    console.error('Erro ao adicionar serviço bloqueado:', err)

    const statusCode =
      err.message.includes('não encontrada') ||
      err.message.includes('já está bloqueado')
        ? 400
        : 500

    res.status(statusCode).json({
      message: 'Erro ao adicionar serviço bloqueado',
      error: err.message
    })
  }
}

const handleRemoveBlockedService = async (req, res) => {
  try {
    const { plataforma, serviceNumber } = req.body

    if (!plataforma || !serviceNumber) {
      return res.status(400).json({
        message:
          'Parâmetros inválidos. Certifique-se de enviar: plataforma (string) e serviceNumber (string).'
      })
    }

    const updatedPlatform = await removeBlockedService(
      plataforma,
      serviceNumber
    )

    res.status(200).json({
      message: 'Serviço bloqueado removido com sucesso',
      updatedPlatform
    })
  } catch (err) {
    console.error('Erro ao remover serviço bloqueado:', err)

    const statusCode =
      err.message.includes('não encontrada') ||
      err.message.includes('não encontrado na lista')
        ? 400
        : 500

    res.status(statusCode).json({
      message: 'Erro ao remover serviço bloqueado',
      error: err.message
    })
  }
}

module.exports = {
  getServices,
  updateCityStatus,
  handleUpdateTimeCity,
  updateServiceStatus,
  handleUpdateStatusAllCities,
  updateCityEmergencyStatus,
  handleUpdateTimeEmergencyCity,
  handleToggleNeighborhoodStatus,
  createNewNeighborhood,
  handleToggleZoneStatus,
  createNewZone,
  handleCreateHoliday,
  handleDeleteHoliday,
  handleAddBlockedService,
  handleRemoveBlockedService
}
