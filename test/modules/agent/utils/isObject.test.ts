import { describe, it, expect } from 'vitest'
import { isObject } from '../../../../src/modules/agent/utils/isObject'

describe('isObject', () => {
  describe('debería retornar true para objetos válidos', () => {
    it('debería retornar true para un objeto vacío', () => {
      expect(isObject({})).toBe(true)
    })

    it('debería retornar true para un objeto con propiedades', () => {
      expect(isObject({ name: 'John', age: 30 })).toBe(true)
    })

    it('debería retornar true para objetos Date', () => {
      expect(isObject(new Date())).toBe(true)
    })

    it('debería retornar true para objetos RegExp', () => {
      expect(isObject(/test/)).toBe(true)
    })

    it('debería retornar true para objetos Error', () => {
      expect(isObject(new Error('test'))).toBe(true)
    })

    it('debería retornar true para objetos Map', () => {
      expect(isObject(new Map())).toBe(true)
    })

    it('debería retornar true para objetos Set', () => {
      expect(isObject(new Set())).toBe(true)
    })

    it('debería retornar true para instancias de clases personalizadas', () => {
      class CustomClass {}
      expect(isObject(new CustomClass())).toBe(true)
    })
  })

  describe('debería retornar false para arrays', () => {
    it('debería retornar false para un array vacío', () => {
      expect(isObject([])).toBe(false)
    })

    it('debería retornar false para un array con elementos', () => {
      expect(isObject([1, 2, 3])).toBe(false)
    })

    it('debería retornar false para arrays con strings', () => {
      expect(isObject(['a', 'b', 'c'])).toBe(false)
    })
  })

  describe('debería retornar false para null', () => {
    it('debería retornar false para null', () => {
      expect(isObject(null)).toBe(false)
    })
  })

  describe('debería retornar false para tipos primitivos', () => {
    it('debería retornar false para undefined', () => {
      expect(isObject(undefined)).toBe(false)
    })

    it('debería retornar false para un string', () => {
      expect(isObject('hello')).toBe(false)
    })

    it('debería retornar false para un string vacío', () => {
      expect(isObject('')).toBe(false)
    })

    it('debería retornar false para un número', () => {
      expect(isObject(42)).toBe(false)
    })

    it('debería retornar false para cero', () => {
      expect(isObject(0)).toBe(false)
    })

    it('debería retornar false para boolean true', () => {
      expect(isObject(true)).toBe(false)
    })

    it('debería retornar false para boolean false', () => {
      expect(isObject(false)).toBe(false)
    })

    it('debería retornar false para NaN', () => {
      expect(isObject(NaN)).toBe(false)
    })

    it('debería retornar false para Infinity', () => {
      expect(isObject(Infinity)).toBe(false)
    })
  })

  describe('debería retornar false para funciones', () => {
    it('debería retornar false para función flecha', () => {
      expect(isObject(() => {})).toBe(false)
    })

    it('debería retornar false para función regular', () => {
      expect(isObject(function() {})).toBe(false)
    })

    it('debería retornar false para función con nombre', () => {
      function namedFunction() {}
      expect(isObject(namedFunction)).toBe(false)
    })
  })

  describe('debería retornar false para symbols', () => {
    it('debería retornar false para un symbol', () => {
      expect(isObject(Symbol('test'))).toBe(false)
    })
  })

  describe('debería retornar false para BigInt', () => {
    it('debería retornar false para BigInt', () => {
      expect(isObject(BigInt(9007199254740991))).toBe(false)
    })
  })
})
