
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
    data: { label: 'URL Input' },
    position: { x: 250, y: 0 },
    style: { backgroundColor: '#f3f4f6', padding: '10px' }
  },
  {
    id: 'fetch',
    data: { label: 'Fetch HTML Content' },
    position: { x: 250, y: 100 },
    style: { backgroundColor: '#dbeafe', padding: '10px' }
  },
  {
    id: 'extract',
    data: { label: 'Extract Main Content' },
    position: { x: 250, y: 200 },
    style: { backgroundColor: '#dcfce7', padding: '10px' }
  },
  {
    id: 'clean',
    data: { label: 'Clean & Format Content' },
    position: { x: 250, y: 300 },
    style: { backgroundColor: '#fef3c7', padding: '10px' }
  },
  {
    id: 'ai',
    data: { label: 'AI Content Processing' },
    position: { x: 250, y: 400 },
    style: { backgroundColor: '#f3e8ff', padding: '10px' }
  },
  {
    id: 'output',
    type: 'output',
    data: { label: 'Formatted Article' },
    position: { x: 250, y: 500 },
    style: { backgroundColor: '#f3f4f6', padding: '10px' }
  },
];

const initialEdges = [
  { id: 'e1', source: 'input', target: 'fetch', animated: true },
  { id: 'e2', source: 'fetch', target: 'extract', animated: true },
  { id: 'e3', source: 'extract', target: 'clean', animated: true },
  { id: 'e4', source: 'clean', target: 'ai', animated: true },
  { id: 'e5', source: 'ai', target: 'output', animated: true },
];

export const ArticleExtractorDiagram = () => {
  const [nodes] = useNodesState(initialNodes);
  const [edges] = useEdgesState(initialEdges);

  return (
    <div style={{ width: '100%', height: '400px' }} className="bg-white rounded-lg shadow-sm">
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
