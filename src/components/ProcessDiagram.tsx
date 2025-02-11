
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
    data: { label: 'Article URL' },
    position: { x: 250, y: 0 },
    style: { backgroundColor: '#f3f4f6', padding: '10px' }
  },
  {
    id: 'extract',
    data: { label: 'HTML Content Extractor' },
    position: { x: 250, y: 100 },
    style: { backgroundColor: '#dbeafe', padding: '10px' }
  },
  {
    id: 'clean',
    data: { label: 'Content Cleaner' },
    position: { x: 250, y: 200 },
    style: { backgroundColor: '#dcfce7', padding: '10px' }
  },
  {
    id: 'metadata',
    data: { label: 'Metadata Parser' },
    position: { x: 100, y: 300 },
    style: { backgroundColor: '#fef3c7', padding: '10px' }
  },
  {
    id: 'content',
    data: { label: 'Content Parser' },
    position: { x: 400, y: 300 },
    style: { backgroundColor: '#fee2e2', padding: '10px' }
  },
  {
    id: 'output',
    type: 'output',
    data: { label: 'Formatted Article' },
    position: { x: 250, y: 400 },
    style: { backgroundColor: '#f3f4f6', padding: '10px' }
  },
];

const initialEdges = [
  { id: 'e1', source: 'input', target: 'extract', animated: true },
  { id: 'e2', source: 'extract', target: 'clean', animated: true },
  { id: 'e3', source: 'clean', target: 'metadata' },
  { id: 'e4', source: 'clean', target: 'content' },
  { id: 'e5', source: 'metadata', target: 'output' },
  { id: 'e6', source: 'content', target: 'output' },
];

export const ProcessDiagram = () => {
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

