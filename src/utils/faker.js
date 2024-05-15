import {faker} from '@faker-js/faker'

const CATEGORIES = ["GPU", "CPU", "Motherboard", "Monitor", "RAM", "Mouse", "Keyboard", "PSU", "Mouse Pad", "HDD", "SSD"]

export const generateProduct = () => {
    return {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        code: faker.string.uuid(),
        stock: faker.number.int({min: 0, max: 100}),
        price: faker.commerce.price(),
        status: faker.datatype.boolean(),
        category: CATEGORIES[faker.number.int({min: 0, max: CATEGORIES.length - 1})],
        thumbnails: []
    }
}