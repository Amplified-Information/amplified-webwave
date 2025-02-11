
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
  {
    id: 'articles',
    type: 'default',
    data: {
      label: (
        <div className="p-2">
          <div className="font-bold border-b pb-2 mb-2">articles</div>
          <div className="text-xs space-y-1 text-left">
            <div>id: uuid</div>
            <div>content: text</div>
            <div>url: text?</div>
            <div>created_at: timestamp</div>
            <div>updated_at: timestamp</div>
          </div>
        </div>
      ),
    },
    position: { x: 50, y: 50 },
    style: { 
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      minWidth: 200 
    }
  },
  {
    id: 'extracted_articles',
    type: 'default',
    data: {
      label: (
        <div className="p-2">
          <div className="font-bold border-b pb-2 mb-2">extracted_articles</div>
          <div className="text-xs space-y-1 text-left">
            <div>id: uuid</div>
            <div>content: text</div>
            <div>title: text?</div>
            <div>description: text?</div>
            <div>author: text?</div>
            <div>source: text?</div>
            <div>url: text?</div>
            <div>published: timestamp?</div>
            <div>ttr: integer?</div>
            <div>created_at: timestamp</div>
          </div>
        </div>
      ),
    },
    position: { x: 300, y: 50 },
    style: { 
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      minWidth: 200 
    }
  },
  {
    id: 'analysis_results',
    type: 'default',
    data: {
      label: (
        <div className="p-2">
          <div className="font-bold border-b pb-2 mb-2">analysis_results</div>
          <div className="text-xs space-y-1 text-left">
            <div>id: uuid</div>
            <div>article_id: uuid</div>
            <div>agent_id: uuid</div>
            <div>analysis_data: jsonb</div>
            <div>confidence_score: numeric?</div>
            <div>status: text</div>
            <div>created_at: timestamp</div>
            <div>updated_at: timestamp</div>
          </div>
        </div>
      ),
    },
    position: { x: 550, y: 50 },
    style: { 
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      minWidth: 200 
    }
  },
];

const initialEdges = [
  {
    id: 'e1',
    source: 'articles',
    target: 'analysis_results',
    animated: true,
    label: '1:n',
    style: { stroke: '#94a3b8' }
  },
];

export const ArticleDatabaseDiagram = () => {
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
