import { describe, expect, it } from "vitest";
import {
    calculatePSU,
    calculatePSUWithOverclock,
    validateConfiguration,
} from "../lib/psu-calculator";
import type { PCConfiguration } from "../shared/types";

describe("PSU Calculator", () => {
  const mockProcessor = {
    id: 1,
    brand: "Intel",
    socket: "LGA1700",
    model: "Core i9-13900K",
    watts: 253,
    maxPowerOc: 340,
  };

  const mockGPU = {
    id: 1,
    brand: "NVIDIA",
    series: "GeForce RTX 40",
    model: "RTX 4090",
    watts: 450,
    maxPowerOc: 550,
  };

  const baseConfig: PCConfiguration = {
    processor: mockProcessor,
    gpu: mockGPU,
    motherboard: null,
    cooling: null,
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
      // Base motherboard default (40) + Processor (253) + GPU (450) + RAM DDR5 (5*2=10)
      // Total: 40 + 253 + 450 + 10 = 753W
      expect(result.totalWatts).toBe(753);
    });

    it("should apply 25% safety margin", () => {
      const result = calculatePSU(baseConfig);
      // 753 * 1.25 = 941.25, rounded up to 950
      expect(result.recommendedPSU).toBe(950);
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
      // 40 + 100 + 200 + 5 = 345W
      // 345 * 1.25 = 431.25, rounds to 450W
      expect(result.recommendedPSU).toBeGreaterThanOrEqual(450);
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
      // Base: 40 + 253 + 450 + 10 = 753, Storage: 5*2 + 8*1 = 18, Total: 771W
      expect(result.totalWatts).toBe(771);
    });

    it("should include PCI Express cards consumption", () => {
      const config: PCConfiguration = {
        ...baseConfig,
        pciExpress1x4: 1,
        pciExpress1x8: 1,
        pciExpress1x16: 1,
      };

      const result = calculatePSU(config);
      // Base: 753 + 10 + 15 + 25 = 803W
      expect(result.totalWatts).toBe(803);
    });

    it("should include optical drives and fans", () => {
      const config: PCConfiguration = {
        ...baseConfig,
        opticalDrives: 1,
        fans: 4,
      };

      const result = calculatePSU(config);
      // Base: 753 + 25 + 20 = 798W
      expect(result.totalWatts).toBe(798);
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
      // Base: 40 + 253 + 450 + (3*4=12) = 755W
      expect(result.totalWatts).toBe(755);
    });

    it("should handle no RAM configuration", () => {
      const noRamConfig: PCConfiguration = {
        ...baseConfig,
        ramType: null,
        ramModules: 0,
      };

      const result = calculatePSU(noRamConfig);
      // Base: 40 + 253 + 450 = 743W
      expect(result.totalWatts).toBe(743);
    });

    it("should include motherboard and cooling consumption", () => {
      const config: PCConfiguration = {
        ...baseConfig,
        motherboard: {
          id: 3,
          tier: "Gama alta",
          chipsetExamples: "Z790",
          powerConsumption: 50,
          additionalRGBPower: 25,
          cpuPowerLimit: 400,
          description: "OC",
          supportsOverclock: true,
        },
        cooling: {
          id: 5,
          size: "360mm",
          fanCount: 3,
          radiatorThickness: "27mm",
          pumpPower: 4,
          fanPower: 9,
          totalPower: 13,
          maxTdpDissipation: 400,
          description: "AIO 360mm",
        },
      };

      const result = calculatePSU(config);
      // Base: 50 (mobo) + 4+9 (cooling pump+fan) + 253 + 450 + 10 = 776W
      expect(result.totalWatts).toBe(776);
    });
  });

  describe("calculatePSUWithOverclock", () => {
    it("should return overclocked result when motherboard supports OC", () => {
      const config: PCConfiguration = {
        ...baseConfig,
        motherboard: {
          id: 3,
          tier: "Gama alta",
          chipsetExamples: "Z790",
          powerConsumption: 50,
          additionalRGBPower: 25,
          cpuPowerLimit: 400,
          description: "OC",
          supportsOverclock: true,
        },
      };

      const result = calculatePSUWithOverclock(config);
      expect(result.overclockAvailable).toBe(true);
      expect(result.overclocked).toBeDefined();
      expect(result.overclocked!.totalWatts).toBeGreaterThan(result.normal.totalWatts);
      // OC: 40 + 340 + 550 + 10 = 940 (no mobo in base for this test - we have motherboard)
      // With mobo 50: 50 + 340 + 550 + 10 = 950
      expect(result.overclocked!.totalWatts).toBe(950);
    });

    it("should not return overclocked when motherboard does not support OC", () => {
      const config: PCConfiguration = {
        ...baseConfig,
        motherboard: {
          id: 1,
          tier: "Gama baja",
          chipsetExamples: "H610",
          powerConsumption: 20,
          additionalRGBPower: 5,
          cpuPowerLimit: 125,
          description: "Basic",
          supportsOverclock: false,
        },
      };

      const result = calculatePSUWithOverclock(config);
      expect(result.overclockAvailable).toBe(false);
      expect(result.overclocked).toBeUndefined();
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

    it("should allow GPU to be null (integrated graphics)", () => {
      const config = {
        ...baseConfig,
        gpu: null,
        processor: mockProcessor,
        ramType: "DDR5" as const,
        ramModules: 2,
      };
      const result = validateConfiguration(config);
      expect(result.valid).toBe(true);
    });

    it("should include integrated GPU consumption when GPU is null", () => {
      const config: PCConfiguration = {
        ...baseConfig,
        gpu: null,
      };
      const result = calculatePSU(config);
      // Base: 40 + 25 (iGPU) + 253 + 10 = 328W
      expect(result.totalWatts).toBe(328);
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
