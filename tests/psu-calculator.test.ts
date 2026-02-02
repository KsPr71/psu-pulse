import { describe, it, expect } from "vitest";
import { calculatePSU, validateConfiguration } from "../lib/psu-calculator";
import type { PCConfiguration } from "../shared/types";

describe("PSU Calculator", () => {
  const mockProcessor = {
    id: 1,
    brand: "Intel",
    socket: "LGA1700",
    model: "Core i9-13900K",
    watts: 253,
  };

  const mockGPU = {
    id: 1,
    brand: "NVIDIA",
    series: "GeForce RTX 40",
    model: "RTX 4090",
    watts: 450,
  };

  const baseConfig: PCConfiguration = {
    processor: mockProcessor,
    gpu: mockGPU,
    ramType: "DDR5",
    ramModules: 2,
    storage: [],
    pciExpress1x4: 0,
    pciExpress1x8: 0,
    pciExpress1x16: 0,
    opticalDrives: 0,
    fans: 0,
  };

  describe("calculatePSU", () => {
    it("should calculate total watts correctly with processor and GPU", () => {
      const result = calculatePSU(baseConfig);
      
      // Base motherboard (80) + Processor (253) + GPU (450) + RAM DDR5 (5*2=10)
      // Total: 80 + 253 + 450 + 10 = 793W
      expect(result.totalWatts).toBe(793);
    });

    it("should apply 25% safety margin", () => {
      const result = calculatePSU(baseConfig);
      
      // 793 * 1.25 = 991.25, rounded up to 1000
      expect(result.recommendedPSU).toBe(1000);
      expect(result.safetyMargin).toBe(0.25);
    });

    it("should recommend correct PSU wattage", () => {
      const config: PCConfiguration = {
        ...baseConfig,
        processor: { ...mockProcessor, watts: 100 },
        gpu: { ...mockGPU, watts: 200 },
        ramModules: 1,
      };

      const result = calculatePSU(config);
      // 80 + 100 + 200 + 5 = 385W
      // 385 * 1.25 = 481.25, rounds to 500W
      expect(result.recommendedPSU).toBeGreaterThanOrEqual(500);
    });

    it("should include storage consumption", () => {
      const config: PCConfiguration = {
        ...baseConfig,
        storage: [
          { typeId: 1, type: "SSD_M2_NVME", quantity: 2, wattsPerUnit: 5 },
          { typeId: 2, type: "HDD_3.5", quantity: 1, wattsPerUnit: 8 },
        ],
      };

      const result = calculatePSU(config);
      // Base: 80 + 253 + 450 + 10 = 793
      // Storage: 5*2 + 8*1 = 18
      // Total: 811W
      expect(result.totalWatts).toBe(811);
    });

    it("should include PCI Express cards consumption", () => {
      const config: PCConfiguration = {
        ...baseConfig,
        pciExpress1x4: 1,
        pciExpress1x8: 1,
        pciExpress1x16: 1,
      };

      const result = calculatePSU(config);
      // Base: 793 + 10 (1x4) + 15 (1x8) + 25 (1x16) = 843W
      expect(result.totalWatts).toBe(843);
    });

    it("should include optical drives and fans", () => {
      const config: PCConfiguration = {
        ...baseConfig,
        opticalDrives: 1,
        fans: 4,
      };

      const result = calculatePSU(config);
      // Base: 793 + 25 (optical) + 20 (4 fans * 5) = 838W
      expect(result.totalWatts).toBe(838);
    });

    it("should recommend correct efficiency rating", () => {
      const lowPowerConfig: PCConfiguration = {
        ...baseConfig,
        processor: { ...mockProcessor, watts: 50 },
        gpu: { ...mockGPU, watts: 100 },
      };

      const result = calculatePSU(lowPowerConfig);
      // Should recommend Bronze for lower wattage
      expect(result.efficiency).toBe("80+ Bronze");
    });

    it("should recommend Platinum for high-power systems", () => {
      const highPowerConfig: PCConfiguration = {
        ...baseConfig,
        processor: { ...mockProcessor, watts: 350 },
        gpu: { ...mockGPU, watts: 500 },
      };

      const result = calculatePSU(highPowerConfig);
      // Should recommend Platinum for 1000W+
      expect(result.efficiency).toBe("80+ Platinum");
    });

    it("should handle DDR4 RAM correctly", () => {
      const ddr4Config: PCConfiguration = {
        ...baseConfig,
        ramType: "DDR4",
        ramModules: 4,
      };

      const result = calculatePSU(ddr4Config);
      // Base: 80 + 253 + 450 + (3*4=12) = 795W
      expect(result.totalWatts).toBe(795);
    });

    it("should handle no RAM configuration", () => {
      const noRamConfig: PCConfiguration = {
        ...baseConfig,
        ramType: null,
        ramModules: 0,
      };

      const result = calculatePSU(noRamConfig);
      // Base: 80 + 253 + 450 = 783W
      expect(result.totalWatts).toBe(783);
    });
  });

  describe("validateConfiguration", () => {
    it("should validate complete configuration", () => {
      const result = validateConfiguration(baseConfig);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should require processor", () => {
      const config = { ...baseConfig, processor: null };
      const result = validateConfiguration(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Debe seleccionar un procesador");
    });

    it("should require GPU", () => {
      const config = { ...baseConfig, gpu: null };
      const result = validateConfiguration(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Debe seleccionar una GPU");
    });

    it("should require RAM configuration", () => {
      const config = { ...baseConfig, ramType: null, ramModules: 0 };
      const result = validateConfiguration(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Debe configurar la memoria RAM");
    });

    it("should require RAM modules when type is selected", () => {
      const config = { ...baseConfig, ramModules: 0 };
      const result = validateConfiguration(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Debe configurar la memoria RAM");
    });
  });
});
