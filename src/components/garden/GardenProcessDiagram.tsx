
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
  {
    id: 'input',
    type: 'input',
    data: { label: 'Garden Input Data' },
    position: { x: 250, y: 0 },
    style: { backgroundColor: '#f3f4f6', padding: '10px' }
  },
  {
    id: 'zone',
    data: { label: 'Zone Analysis Agent' },
    position: { x: 100, y: 100 },
    style: { backgroundColor: '#dbeafe', padding: '10px' }
  },
  {
    id: 'companion',
    data: { label: 'Companion Planting Agent' },
    position: { x: 400, y: 100 },
    style: { backgroundColor: '#dcfce7', padding: '10px' }
  },
  {
    id: 'space',
    data: { label: 'Space Optimization Agent' },
    position: { x: 100, y: 200 },
    style: { backgroundColor: '#fef3c7', padding: '10px' }
  },
  {
    id: 'timing',
    data: { label: 'Planting Schedule Agent' },
    position: { x: 400, y: 200 },
    style: { backgroundColor: '#fee2e2', padding: '10px' }
  },
  {
    id: 'lead',
    data: { label: 'Garden Planning Lead' },
    position: { x: 250, y: 300 },
    style: { backgroundColor: '#f3e8ff', padding: '10px' }
  },
  {
    id: 'output',
    type: 'output',
    data: { label: 'Garden Planning Report' },
    position: { x: 250, y: 400 },
    style: { backgroundColor: '#f3f4f6', padding: '10px' }
  },
];

const initialEdges = [
  { id: 'e1-1', source: 'input', target: 'zone', animated: true },
  { id: 'e1-2', source: 'input', target: 'companion', animated: true },
  { id: 'e1-3', source: 'input', target: 'space', animated: true },
  { id: 'e1-4', source: 'input', target: 'timing', animated: true },
  { id: 'e2-1', source: 'zone', target: 'lead' },
  { id: 'e2-2', source: 'companion', target: 'lead' },
  { id: 'e2-3', source: 'space', target: 'lead' },
  { id: 'e2-4', source: 'timing', target: 'lead' },
  { id: 'e3', source: 'lead', target: 'output', animated: true },
];

export const GardenProcessDiagram = () => {
  const [nodes] = useNodesState(initialNodes);
  const [edges] = useEdgesState(initialEdges);

  return (
    <div style={{ width: '100%', height: '500px' }} className="bg-white rounded-lg shadow-sm">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        attributionPosition="bottom-right"
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};
