// src/app/assets/js/warriorService.js
export class WarriorService {
    constructor() {
        this.apiUrl = 'http://localhost:3000/game/warriors';
    }

    // Método existente para todos los guerreros
    async getAllWarriors() {
        try {
            const response = await fetch(this.apiUrl);
            if (!response.ok) throw new Error('Error al obtener guerreros');
            return await response.json();
        } catch (error) {
            console.error('Error al obtener guerreros:', error);
            throw error;
        }
    }

    // Nuevo método para un solo guerrero
    async getWarriorById(id) {
        try {
            const response = await fetch(`${this.apiUrl}/${id}`);
            if (!response.ok) throw new Error('Guerrero no encontrado');
            return await response.json();
        } catch (error) {
            console.error('Error al obtener guerrero:', error);
            throw error;
        }
    }
}

// Nuevo método para obtener entrenadores
export async function getTrainers() {
    try {
        const response = await fetch('http://localhost:3000/game/trainers');
        if (!response.ok) throw new Error('Error al obtener entrenadores');
        return await response.json();
    } catch (error) {
        console.error('Error al obtener entrenadores:', error);
        throw error;
    }
}
