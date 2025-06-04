const { ScanCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb')
const db = require('../db/db')

const TABLE_SERVICES = process.env.DYNAMODB_TABLE_SERVICES

const getAllServices = async () => {
  try {
    const command = new ScanCommand({
      TableName: TABLE_SERVICES
    })
    const response = await db.send(command)

    return response.Items
  } catch (err) {
    console.error(err)
    throw new Error('Error getting services')
  }
}

const updateTimeCity = async (platform, cityName, value, field) => {
  try {
    const command = new ScanCommand({
      TableName: TABLE_SERVICES,
      FilterExpression: 'plataforma = :platform',
      ExpressionAttributeValues: {
        ':platform': platform
      }
    })

    const response = await db.send(command)
    const item = response.Items[0]
    if (!item) throw new Error(`Plataforma '${platform}' não encontrada`)
    const cityIndex = item.cities.findIndex((city) => city.city === cityName)
    if (cityIndex === -1)
      throw new Error(
        `Cidade '${cityName}' não encontrada na plataforma '${platform}'`
      )

    item.cities[cityIndex][field] = value

    const updateCommand = new UpdateCommand({
      TableName: TABLE_SERVICES,
      Key: { plataforma: platform },
      UpdateExpression: `SET cities[${cityIndex}].${field} = :value`,
      ExpressionAttributeValues: {
        ':value': value
      },
      ReturnValues: 'UPDATED_NEW'
    })

    const updateResponse = await db.send(updateCommand)
    return updateResponse.Attributes
  } catch (err) {
    console.error(err)
    throw new Error(err.message)
  }
}

const updateStatusCity = async (platform, cityName, value) => {
  try {
    // Buscar o item pelo nome da plataforma
    const command = new ScanCommand({
      TableName: TABLE_SERVICES,
      FilterExpression: 'plataforma = :platform',
      ExpressionAttributeValues: {
        ':platform': platform
      }
    })

    const response = await db.send(command)
    const item = response.Items[0]
    if (!item) throw new Error(`Plataforma '${platform}' não encontrada`)

    const cityIndex = item.cities.findIndex((city) => city.city === cityName)
    if (cityIndex === -1)
      throw new Error(
        `Cidade '${cityName}' não encontrada na plataforma '${platform}'`
      )

    item.cities[cityIndex].active = value

    const updateCommand = new UpdateCommand({
      TableName: TABLE_SERVICES,
      Key: { plataforma: platform },
      UpdateExpression: `SET cities[${cityIndex}].active = :value`,
      ExpressionAttributeValues: {
        ':value': value
      },
      ReturnValues: 'UPDATED_NEW'
    })

    const updateResponse = await db.send(updateCommand)
    return updateResponse.Attributes
  } catch (err) {
    console.error(err)
    throw new Error(err.message)
  }
}

const updateStatusEmergencyCity = async (platform, cityName, value) => {
  try {
    // Buscar o item pelo nome da plataforma
    const command = new ScanCommand({
      TableName: TABLE_SERVICES,
      FilterExpression: 'plataforma = :platform',
      ExpressionAttributeValues: {
        ':platform': platform
      }
    })

    const response = await db.send(command)
    const item = response.Items[0]
    if (!item) throw new Error(`Plataforma '${platform}' não encontrada`)

    const cityIndex = item.cities.findIndex((city) => city.city === cityName)
    if (cityIndex === -1)
      throw new Error(
        `Cidade '${cityName}' não encontrada na plataforma '${platform}'`
      )

    item.cities[cityIndex].active = value

    const updateCommand = new UpdateCommand({
      TableName: TABLE_SERVICES,
      Key: { plataforma: platform },
      UpdateExpression: `SET cities[${cityIndex}].is_emergency = :value`,
      ExpressionAttributeValues: {
        ':value': value
      },
      ReturnValues: 'UPDATED_NEW'
    })

    const updateResponse = await db.send(updateCommand)
    return updateResponse.Attributes
  } catch (err) {
    console.error(err)
    throw new Error(err.message)
  }
}

const updateTimeEmergencyCity = async (platform, cityName, value, field) => {
  try {
    const command = new ScanCommand({
      TableName: TABLE_SERVICES,
      FilterExpression: 'plataforma = :platform',
      ExpressionAttributeValues: {
        ':platform': platform
      }
    })

    const response = await db.send(command)
    const item = response.Items[0]
    if (!item) throw new Error(`Plataforma '${platform}' não encontrada`)
    const cityIndex = item.cities.findIndex((city) => city.city === cityName)
    if (cityIndex === -1)
      throw new Error(
        `Cidade '${cityName}' não encontrada na plataforma '${platform}'`
      )

    item.cities[cityIndex][field] = value

    const updateCommand = new UpdateCommand({
      TableName: TABLE_SERVICES,
      Key: { plataforma: platform },
      UpdateExpression: `SET cities[${cityIndex}].${field} = :value`,
      ExpressionAttributeValues: {
        ':value': value
      },
      ReturnValues: 'UPDATED_NEW'
    })

    const updateResponse = await db.send(updateCommand)
    return updateResponse.Attributes
  } catch (err) {
    console.error(err)
    throw new Error(err.message)
  }
}

const updateStatusService = async (platform, serviceName, value) => {
  try {
    const command = new ScanCommand({
      TableName: TABLE_SERVICES,
      FilterExpression: 'plataforma = :platform',
      ExpressionAttributeValues: {
        ':platform': platform
      }
    })

    const response = await db.send(command)
    const item = response.Items[0]
    if (!item) throw new Error(`Plataforma '${platform}' não encontrada`)

    const serviceIndex = item.services.findIndex(
      (service) => service.service === serviceName
    )
    if (serviceIndex === -1)
      throw new Error(
        `Serviço '${serviceName}' não encontrado na plataforma '${platform}'`
      )

    item.services[serviceIndex].active = value

    const updateCommand = new UpdateCommand({
      TableName: TABLE_SERVICES,
      Key: { plataforma: platform },
      UpdateExpression: `SET services[${serviceIndex}].active = :value`,
      ExpressionAttributeValues: {
        ':value': value
      },
      ReturnValues: 'UPDATED_NEW'
    })

    const updateResponse = await db.send(updateCommand)
    return updateResponse.Attributes
  } catch (err) {
    console.error(err)
    throw new Error(err.message)
  }
}

const updateTimeAllCities = async (platform, value, field) => {
  try {
    const command = new ScanCommand({
      TableName: TABLE_SERVICES,
      FilterExpression: 'plataforma = :platform',
      ExpressionAttributeValues: {
        ':platform': platform
      }
    })

    const response = await db.send(command)
    const item = response.Items[0]
    if (!item) throw new Error(`Plataforma '${platform}' não encontrada`)

    // Atualiza o campo para todas as cidades
    item.cities.forEach((city) => {
      city[field] = value
    })

    const updateCommand = new UpdateCommand({
      TableName: TABLE_SERVICES,
      Key: { plataforma: platform },
      UpdateExpression: `SET cities = :cities`,
      ExpressionAttributeValues: {
        ':cities': item.cities
      },
      ReturnValues: 'UPDATED_NEW'
    })

    const updateResponse = await db.send(updateCommand)
    return updateResponse.Attributes
  } catch (err) {
    console.error(err)
    throw new Error(err.message)
  }
}

const updateStatusAllCities = async (platform, value) => {
  try {
    const command = new ScanCommand({
      TableName: TABLE_SERVICES,
      FilterExpression: 'plataforma = :platform',
      ExpressionAttributeValues: {
        ':platform': platform
      }
    })

    const response = await db.send(command)
    const item = response.Items[0]
    if (!item) throw new Error(`Plataforma '${platform}' não encontrada`)

    // Atualiza o status para todas as cidades
    item.cities.forEach((city) => {
      city.active = value
    })

    const updateCommand = new UpdateCommand({
      TableName: TABLE_SERVICES,
      Key: { plataforma: platform },
      UpdateExpression: `SET cities = :cities`,
      ExpressionAttributeValues: {
        ':cities': item.cities
      },
      ReturnValues: 'UPDATED_NEW'
    })

    const updateResponse = await db.send(updateCommand)
    return updateResponse.Attributes
  } catch (err) {
    console.error(err)
    throw new Error(err.message)
  }
}

const toggleNeighborhoodStatus = async (
  platform,
  cityName,
  neighborhoodName,
  value
) => {
  try {
    // Buscar o item pelo nome da plataforma
    const command = new ScanCommand({
      TableName: TABLE_SERVICES,
      FilterExpression: 'plataforma = :platform',
      ExpressionAttributeValues: {
        ':platform': platform
      }
    })

    const response = await db.send(command)
    const item = response.Items[0]
    if (!item) throw new Error(`Plataforma '${platform}' não encontrada`)

    // Encontrar a cidade
    const cityIndex = item.cities.findIndex((city) => city.city === cityName)
    if (cityIndex === -1)
      throw new Error(
        `Cidade '${cityName}' não encontrada na plataforma '${platform}'`
      )

    // Encontrar o bairro
    const neighborhoodIndex = item.cities[cityIndex].neighborhoods.findIndex(
      (neighborhood) => neighborhood.name === neighborhoodName
    )
    if (neighborhoodIndex === -1)
      throw new Error(
        `Bairro '${neighborhoodName}' não encontrado na cidade '${cityName}'`
      )

    // Atualizar o status do bairro
    item.cities[cityIndex].neighborhoods[neighborhoodIndex].active = value

    const updateCommand = new UpdateCommand({
      TableName: TABLE_SERVICES,
      Key: { plataforma: platform },
      UpdateExpression: `SET cities[${cityIndex}].neighborhoods[${neighborhoodIndex}].active = :value`,
      ExpressionAttributeValues: {
        ':value': value
      },
      ReturnValues: 'UPDATED_NEW'
    })

    const updateResponse = await db.send(updateCommand)
    return updateResponse.Attributes
  } catch (err) {
    console.error(err)
    throw new Error(err.message)
  }
}

const createNeighborhood = async (
  platform,
  cityName,
  neighborhoodName,
  isActive
) => {
  try {
    // Buscar o item pelo nome da plataforma
    const command = new ScanCommand({
      TableName: TABLE_SERVICES,
      FilterExpression: 'plataforma = :platform',
      ExpressionAttributeValues: {
        ':platform': platform
      }
    })

    const response = await db.send(command)
    const item = response.Items[0]
    if (!item) throw new Error(`Plataforma '${platform}' não encontrada`)

    // Encontrar a cidade
    const cityIndex = item.cities.findIndex((city) => city.city === cityName)
    if (cityIndex === -1)
      throw new Error(
        `Cidade '${cityName}' não encontrada na plataforma '${platform}'`
      )

    // Verificar se o bairro já existe
    const neighborhoodExists = item.cities[cityIndex].neighborhoods.some(
      (neighborhood) => neighborhood.name === neighborhoodName
    )
    if (neighborhoodExists)
      throw new Error(
        `Bairro '${neighborhoodName}' já existe na cidade '${cityName}'`
      )

    // Criar novo bairro
    const newNeighborhood = {
      active: isActive,
      name: neighborhoodName
    }

    // Adicionar o novo bairro ao array de bairros
    item.cities[cityIndex].neighborhoods.push(newNeighborhood)

    const updateCommand = new UpdateCommand({
      TableName: TABLE_SERVICES,
      Key: { plataforma: platform },
      UpdateExpression: `SET cities[${cityIndex}].neighborhoods = :neighborhoods`,
      ExpressionAttributeValues: {
        ':neighborhoods': item.cities[cityIndex].neighborhoods
      },
      ReturnValues: 'UPDATED_NEW'
    })

    const updateResponse = await db.send(updateCommand)
    return updateResponse.Attributes
  } catch (err) {
    console.error(err)
    throw new Error(err.message)
  }
}

const toggleZoneStatus = async (platform, cityName, zoneName, value) => {
  try {
    // Buscar o item pelo nome da plataforma
    const command = new ScanCommand({
      TableName: TABLE_SERVICES,
      FilterExpression: 'plataforma = :platform',
      ExpressionAttributeValues: {
        ':platform': platform
      }
    })

    const response = await db.send(command)
    const item = response.Items[0]
    if (!item) throw new Error(`Plataforma '${platform}' não encontrada`)

    // Encontrar a cidade
    const cityIndex = item.cities.findIndex((city) => city.city === cityName)
    if (cityIndex === -1)
      throw new Error(
        `Cidade '${cityName}' não encontrada na plataforma '${platform}'`
      )

    // Verificar se a cidade tem zonas
    if (!item.cities[cityIndex].zones) {
      throw new Error(`Nenhuma zona encontrada na cidade '${cityName}'`)
    }

    // Encontrar a zona
    const zoneIndex = item.cities[cityIndex].zones.findIndex(
      (zone) => zone.name === zoneName
    )
    if (zoneIndex === -1)
      throw new Error(
        `Zona '${zoneName}' não encontrada na cidade '${cityName}'`
      )

    // Atualizar o status da zona
    item.cities[cityIndex].zones[zoneIndex].active = value

    const updateCommand = new UpdateCommand({
      TableName: TABLE_SERVICES,
      Key: { plataforma: platform },
      UpdateExpression: `SET cities[${cityIndex}].zones[${zoneIndex}].active = :value`,
      ExpressionAttributeValues: {
        ':value': value
      },
      ReturnValues: 'UPDATED_NEW'
    })

    const updateResponse = await db.send(updateCommand)
    return updateResponse.Attributes
  } catch (err) {
    console.error(err)
    throw new Error(err.message)
  }
}

const createZone = async (platform, cityName, zoneName, isActive) => {
  try {
    // Buscar o item pelo nome da plataforma
    const command = new ScanCommand({
      TableName: TABLE_SERVICES,
      FilterExpression: 'plataforma = :platform',
      ExpressionAttributeValues: {
        ':platform': platform
      }
    })

    const response = await db.send(command)
    const item = response.Items[0]
    if (!item) throw new Error(`Plataforma '${platform}' não encontrada`)

    // Encontrar a cidade
    const cityIndex = item.cities.findIndex((city) => city.city === cityName)
    if (cityIndex === -1)
      throw new Error(
        `Cidade '${cityName}' não encontrada na plataforma '${platform}'`
      )

    // Verificar se a zona já existe
    const zoneExists = item.cities[cityIndex].zones.some(
      (zone) => zone.name === zoneName
    )
    if (zoneExists)
      throw new Error(`Zona '${zoneName}' já existe na cidade '${cityName}'`)

    // Criar nova zona
    const newZone = {
      active: isActive,
      name: zoneName
    }

    // Adicionar a nova zona ao array de zonas
    // Verifica se o array zones existe, se não, cria um novo
    if (!item.cities[cityIndex].zones) {
      item.cities[cityIndex].zones = []
    }
    item.cities[cityIndex].zones.push(newZone)

    const updateCommand = new UpdateCommand({
      TableName: TABLE_SERVICES,
      Key: { plataforma: platform },
      UpdateExpression: `SET cities[${cityIndex}].zones = :zones`,
      ExpressionAttributeValues: {
        ':zones': item.cities[cityIndex].zones
      },
      ReturnValues: 'UPDATED_NEW'
    })

    const updateResponse = await db.send(updateCommand)
    return updateResponse.Attributes
  } catch (err) {
    console.error(err)
    throw new Error(err.message)
  }
}

const createHoliday = async (platform, holidayName, holidayDate) => {
  try {
    // Buscar o item pelo nome da plataforma
    const command = new ScanCommand({
      TableName: TABLE_SERVICES,
      FilterExpression: 'plataforma = :platform',
      ExpressionAttributeValues: {
        ':platform': platform
      }
    })

    const response = await db.send(command)
    const item = response.Items[0]
    if (!item) throw new Error(`Plataforma '${platform}' não encontrada`)

    // Verificar se o HOLIDAY já existe DATA E NOME
    const holidayExists = item.feriados.some(
      (holiday) => holiday.nome === holidayName && holiday.data === holidayDate
    )

    if (holidayExists)
      throw new Error('Feriado já cadastrado com o mesmo nome ou data')

    // Criar novo feriado
    const newHoliday = {
      nome: holidayName,
      data: holidayDate
    }

    // Adicionar o novo feriado ao array de feriados
    item.feriados.push(newHoliday)
    const updateCommand = new UpdateCommand({
      TableName: TABLE_SERVICES,
      Key: { plataforma: platform },
      UpdateExpression: 'SET feriados = :feriados',
      ExpressionAttributeValues: {
        ':feriados': item.feriados
      },
      ReturnValues: 'UPDATED_NEW'
    })

    const updateResponse = await db.send(updateCommand)
    return updateResponse.Attributes
  } catch (err) {
    console.error(err)
    throw new Error(err.message)
  }
}

const deleteHoliday = async (platform, holidayName, holidayDate) => {
  try {
    // Buscar o item pelo nome da plataforma
    const command = new ScanCommand({
      TableName: TABLE_SERVICES,
      FilterExpression: 'plataforma = :platform',
      ExpressionAttributeValues: {
        ':platform': platform
      }
    })

    const response = await db.send(command)
    const item = response.Items[0]
    if (!item) throw new Error(`Plataforma '${platform}' não encontrada`)

    // Verificar se o feriado existe
    const holidayIndex = item.feriados.findIndex(
      (holiday) => holiday.nome === holidayName && holiday.data === holidayDate
    )

    if (holidayIndex === -1) {
      throw new Error('Feriado não encontrado com o nome e data fornecidos')
    }

    // Remover o feriado do array
    item.feriados.splice(holidayIndex, 1)

    // Atualizar o item no DynamoDB
    const updateCommand = new UpdateCommand({
      TableName: TABLE_SERVICES,
      Key: { plataforma: platform },
      UpdateExpression: 'SET feriados = :feriados',
      ExpressionAttributeValues: {
        ':feriados': item.feriados
      },
      ReturnValues: 'UPDATED_NEW'
    })

    const updateResponse = await db.send(updateCommand)
    return updateResponse.Attributes
  } catch (err) {
    console.error(err)
    throw new Error(err.message)
  }
}

const addBlockedService = async (platform, serviceNumber) => {
  try {
    // Buscar o item pelo nome da plataforma
    const command = new ScanCommand({
      TableName: TABLE_SERVICES,
      FilterExpression: 'plataforma = :platform',
      ExpressionAttributeValues: {
        ':platform': platform
      }
    })

    const response = await db.send(command)
    const item = response.Items[0]
    if (!item) throw new Error(`Plataforma '${platform}' não encontrada`)

    // Verificar se o serviço já está bloqueado
    if (!item.servicos_bloqueados) {
      item.servicos_bloqueados = [] // Inicializa o array se não existir
    }

    const serviceExists = item.servicos_bloqueados.includes(serviceNumber)

    if (serviceExists) {
      throw new Error('Número de serviço já está bloqueado')
    }

    // Adicionar o novo serviço bloqueado ao array
    item.servicos_bloqueados.push(serviceNumber)

    // Atualizar o item no DynamoDB
    const updateCommand = new UpdateCommand({
      TableName: TABLE_SERVICES,
      Key: { plataforma: platform },
      UpdateExpression: 'SET servicos_bloqueados = :servicos_bloqueados',
      ExpressionAttributeValues: {
        ':servicos_bloqueados': item.servicos_bloqueados
      },
      ReturnValues: 'UPDATED_NEW'
    })

    const updateResponse = await db.send(updateCommand)
    return updateResponse.Attributes
  } catch (err) {
    console.error(err)
    throw new Error(err.message)
  }
}

const removeBlockedService = async (platform, serviceNumber) => {
  try {
    const command = new ScanCommand({
      TableName: TABLE_SERVICES,
      FilterExpression: 'plataforma = :platform',
      ExpressionAttributeValues: {
        ':platform': platform
      }
    })

    const response = await db.send(command)
    const item = response.Items[0]
    if (!item) throw new Error(`Plataforma '${platform}' não encontrada`)

    if (!item.servicos_bloqueados || item.servicos_bloqueados.length === 0) {
      throw new Error('Nenhum serviço bloqueado encontrado')
    }

    const serviceIndex = item.servicos_bloqueados.indexOf(serviceNumber)

    if (serviceIndex === -1) {
      throw new Error('Número de serviço não encontrado na lista de bloqueados')
    }

    item.servicos_bloqueados.splice(serviceIndex, 1)

    const updateCommand = new UpdateCommand({
      TableName: TABLE_SERVICES,
      Key: { plataforma: platform },
      UpdateExpression: 'SET servicos_bloqueados = :servicos_bloqueados',
      ExpressionAttributeValues: {
        ':servicos_bloqueados': item.servicos_bloqueados
      },
      ReturnValues: 'UPDATED_NEW'
    })

    const updateResponse = await db.send(updateCommand)
    return updateResponse.Attributes
  } catch (err) {
    console.error(err)
    throw new Error(err.message)
  }
}

module.exports = {
  getAllServices,
  updateStatusCity,
  updateTimeAllCities,
  updateStatusAllCities,
  updateStatusEmergencyCity,
  updateTimeEmergencyCity,
  toggleNeighborhoodStatus,
  createNeighborhood,
  updateStatusService,
  updateTimeCity,
  toggleZoneStatus,
  createZone,
  createHoliday,
  deleteHoliday,
  addBlockedService,
  removeBlockedService
}
