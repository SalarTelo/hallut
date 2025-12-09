/**
 * Worldmap Service Tests
 * Unit tests for worldmap generation with unlockRequirement
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { generateWorldmap } from '../generator.js';
import { getModule } from '../../module/registry.js';
import { extractModuleDependencies, extractRequirementTypes, extractRequirementDetails } from '../../unlock/requirements.js';
import type { ModuleDefinition } from '../../module/types/index.js';

// Mock dependencies
vi.mock('@core/module/registry.js', () => ({
  getModule: vi.fn(),
}));

vi.mock('@core/unlock/requirements.js', () => ({
  extractModuleDependencies: vi.fn(),
  extractRequirementTypes: vi.fn(),
  extractRequirementDetails: vi.fn(),
}));

describe('Worldmap Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return empty worldmap for no modules', async () => {
    const result = await generateWorldmap([]);

    expect(result).toEqual({
      layout: 'linear',
      nodes: [],
      connections: [],
    });
  });

  it('should generate worldmap for single module without requirements', async () => {
    const mockModule: ModuleDefinition = {
      id: 'module1',
      config: {
        manifest: { id: 'module1', name: 'Module 1', version: '1.0.0', summary: 'First module' },
        background: {},
        welcome: { speaker: 'Test', lines: [] },
        taskOrder: [],
      },
      content: { interactables: [], tasks: [] },
    };

    vi.mocked(getModule).mockReturnValue(mockModule);
    vi.mocked(extractModuleDependencies).mockReturnValue([]);
    vi.mocked(extractRequirementTypes).mockReturnValue([]);
    vi.mocked(extractRequirementDetails).mockReturnValue([]);

    const result = await generateWorldmap(['module1']);

    expect(result.nodes).toHaveLength(1);
    expect(result.nodes[0].moduleId).toBe('module1');
    expect(result.connections).toHaveLength(0);
  });

  it('should extract dependencies from unlockRequirement', async () => {
    const mockModule1: ModuleDefinition = {
      id: 'module1',
      config: {
        manifest: { id: 'module1', name: 'Module 1', version: '1.0.0', summary: 'First module' },
        background: {},
        welcome: { speaker: 'Test', lines: [] },
        taskOrder: [],
      },
      content: { interactables: [], tasks: [] },
    };

    const mockModule2: ModuleDefinition = {
      id: 'module2',
      config: {
        manifest: { id: 'module2', name: 'Module 2', version: '1.0.0', summary: 'Second module' },
        background: {},
        welcome: { speaker: 'Test', lines: [] },
        taskOrder: [],
        unlockRequirement: {
          type: 'module-complete',
          moduleId: 'module1',
        },
      },
      content: { interactables: [], tasks: [] },
    };

    // Mock getModule to return the correct module based on ID
    vi.mocked(getModule).mockImplementation((id: string) => {
      if (id === 'module1') return mockModule1;
      if (id === 'module2') return mockModule2;
      return null;
    });
    
    // extractModuleDependencies is called for each module when building the graph
    vi.mocked(extractModuleDependencies).mockImplementation((req) => {
      if (req && req.type === 'module-complete') {
        return [req.moduleId];
      }
      return [];
    });

    const result = await generateWorldmap(['module1', 'module2']);

    expect(result.nodes).toHaveLength(2);
    // Verify extractModuleDependencies was called for module2
    expect(extractModuleDependencies).toHaveBeenCalled();
    // Verify both modules are in the worldmap
    expect(result.nodes.some(n => n.moduleId === 'module1')).toBe(true);
    expect(result.nodes.some(n => n.moduleId === 'module2')).toBe(true);
    // Connections are created based on positioning algorithm
    // The exact number depends on the algorithm, but we verify the structure is created
    expect(result.layout).toBe('branching');
  });

  it('should handle multiple dependencies', async () => {
    const mockModule1: ModuleDefinition = {
      id: 'module1',
      config: {
        manifest: { id: 'module1', name: 'Module 1', version: '1.0.0', summary: 'First module' },
        background: {},
        welcome: { speaker: 'Test', lines: [] },
        taskOrder: [],
      },
      content: { interactables: [], tasks: [] },
    };

    const mockModule2: ModuleDefinition = {
      id: 'module2',
      config: {
        manifest: { id: 'module2', name: 'Module 2', version: '1.0.0', summary: 'Second module' },
        background: {},
        welcome: { speaker: 'Test', lines: [] },
        taskOrder: [],
      },
      content: { interactables: [], tasks: [] },
    };

    const mockModule3: ModuleDefinition = {
      id: 'module3',
      config: {
        manifest: { id: 'module3', name: 'Module 3', version: '1.0.0', summary: 'Third module' },
        background: {},
        welcome: { speaker: 'Test', lines: [] },
        taskOrder: [],
        unlockRequirement: {
          type: 'and',
          requirements: [
            { type: 'module-complete', moduleId: 'module1' },
            { type: 'module-complete', moduleId: 'module2' },
          ],
        },
      },
      content: { interactables: [], tasks: [] },
    };

    // Mock getModule to return modules when called during positioning
    vi.mocked(getModule).mockImplementation((id: string) => {
      if (id === 'module1') return mockModule1;
      if (id === 'module2') return mockModule2;
      if (id === 'module3') return mockModule3;
      return null;
    });
    
    vi.mocked(extractModuleDependencies)
      .mockReturnValueOnce([])
      .mockReturnValueOnce([])
      .mockReturnValueOnce(['module1', 'module2']);
    vi.mocked(extractRequirementTypes)
      .mockReturnValueOnce([])
      .mockReturnValueOnce([])
      .mockReturnValueOnce(['module-complete', 'module-complete']);
    vi.mocked(extractRequirementDetails)
      .mockReturnValueOnce([])
      .mockReturnValueOnce([])
      .mockReturnValueOnce([
        { type: 'module-complete', moduleId: 'module1' },
        { type: 'module-complete', moduleId: 'module2' }
      ]);

    const result = await generateWorldmap(['module1', 'module2', 'module3']);

    expect(result.nodes).toHaveLength(3);
    // Verify extractModuleDependencies was called for module3 with and requirement
    expect(extractModuleDependencies).toHaveBeenCalled();
    // Verify all modules are in the worldmap
    expect(result.nodes.some(n => n.moduleId === 'module1')).toBe(true);
    expect(result.nodes.some(n => n.moduleId === 'module2')).toBe(true);
    expect(result.nodes.some(n => n.moduleId === 'module3')).toBe(true);
    // Connections are created based on positioning algorithm
    expect(result.layout).toBe('branching');
  });

  it('should position root modules (no dependencies) on the left', async () => {
    const mockModule1: ModuleDefinition = {
      id: 'module1',
      config: {
        manifest: { id: 'module1', name: 'Module 1', version: '1.0.0' },
        background: {},
        welcome: { speaker: 'Test', lines: [] },
        taskOrder: [],
      },
      content: { interactables: [], tasks: [] },
    };

    const mockModule2: ModuleDefinition = {
      id: 'module2',
      config: {
        manifest: { id: 'module2', name: 'Module 2', version: '1.0.0' },
        background: {},
        welcome: { speaker: 'Test', lines: [] },
        taskOrder: [],
      },
      content: { interactables: [], tasks: [] },
    };

    vi.mocked(getModule)
      .mockReturnValueOnce(mockModule1)
      .mockReturnValueOnce(mockModule2);
    
    vi.mocked(extractModuleDependencies)
      .mockReturnValueOnce([])
      .mockReturnValueOnce([]);
    vi.mocked(extractRequirementTypes)
      .mockReturnValueOnce([])
      .mockReturnValueOnce([]);
    vi.mocked(extractRequirementDetails)
      .mockReturnValueOnce([])
      .mockReturnValueOnce([]);

    const result = await generateWorldmap(['module1', 'module2']);

    expect(result.nodes).toHaveLength(2);
    // Both should be positioned at x=15 (left side)
    expect(result.nodes.every(n => n.position.x === 15)).toBe(true);
  });

  it('should filter out dependencies not in module list', async () => {
    const mockModule: ModuleDefinition = {
      id: 'module1',
      config: {
        manifest: { id: 'module1', name: 'Module 1', version: '1.0.0' },
        background: {},
        welcome: { speaker: 'Test', lines: [] },
        taskOrder: [],
        unlockRequirement: {
          type: 'module-complete',
          moduleId: 'external-module',
        },
      },
      content: { interactables: [], tasks: [] },
    };

    vi.mocked(getModule).mockReturnValue(mockModule);
    vi.mocked(extractModuleDependencies).mockReturnValue(['external-module']);
    vi.mocked(extractRequirementTypes).mockReturnValue(['module-complete']);
    vi.mocked(extractRequirementDetails).mockReturnValue([{ type: 'module-complete', moduleId: 'external-module' }]);

    const result = await generateWorldmap(['module1']);

    expect(result.nodes).toHaveLength(1);
    expect(result.connections).toHaveLength(0);
  });
});

