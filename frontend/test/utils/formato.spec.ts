import { describe, expect, it } from 'vitest'
import {
  formatearMoneda,
  formatearPorcentaje,
  formatearFecha,
} from '../../src/utils/formato'

describe('formatearMoneda', () => {
  it('formatea un valor numérico como moneda colombiana', () => {
    expect(formatearMoneda(2500000)).toContain('2.500.000,00')
  })

  it('acepta valores numéricos enviados como texto', () => {
    expect(formatearMoneda('150000')).toContain('150.000,00')
  })

  it('devuelve un valor por defecto cuando recibe un dato inválido', () => {
    expect(formatearMoneda('invalido')).toBe('$ 0,00')
  })
})

describe('formatearPorcentaje', () => {
  it('formatea correctamente un porcentaje', () => {
    expect(formatearPorcentaje(10)).toBe('10,00 %')
  })

  it('acepta porcentajes enviados como texto', () => {
    expect(formatearPorcentaje('25.5')).toBe('25,50 %')
  })

  it('devuelve un porcentaje por defecto ante un dato inválido', () => {
    expect(formatearPorcentaje('invalido')).toBe('0,00 %')
  })
})

describe('formatearFecha', () => {
  it('formatea una fecha en formato día/mes/año', () => {
    expect(formatearFecha('2026-11-15')).toBe('15/11/2026')
  })

  it('devuelve una cadena vacía cuando no recibe fecha', () => {
    expect(formatearFecha('')).toBe('')
  })

  it('devuelve el valor original cuando la fecha es inválida', () => {
    expect(formatearFecha('fecha-invalida')).toBe('fecha-invalida')
  })
})