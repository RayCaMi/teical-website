import { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import TitleIcon from '@mui/icons-material/Title';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import LinkIcon from '@mui/icons-material/Link';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditNoteIcon from '@mui/icons-material/EditNote';

interface MarkdownEditorProps {
  value: string;
  onChange: (valor: string) => void;
  rows?: number;
  placeholder?: string;
}

// Editor de texto com barra de formatação e prévia. Guarda o texto em Markdown
// (mesmo formato que a página da notícia renderiza), sem dependências externas.
export default function MarkdownEditor({ value, onChange, rows = 14, placeholder }: MarkdownEditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);

  // Aplica uma formatação ao redor (ou no início) do texto selecionado
  const aplicar = (antes: string, depois = "", porLinha = false) => {
    const ta = ref.current;
    if (!ta) return;
    const ini = ta.selectionStart;
    const fim = ta.selectionEnd;
    const selecionado = value.slice(ini, fim);

    let novoTrecho: string;
    if (porLinha) {
      // Prefixo por linha (títulos, listas, citações)
      const linhas = (selecionado || "texto").split("\n");
      novoTrecho = linhas.map(l => `${antes}${l}`).join("\n");
    } else {
      novoTrecho = `${antes}${selecionado || "texto"}${depois}`;
    }

    const novoValor = value.slice(0, ini) + novoTrecho + value.slice(fim);
    onChange(novoValor);
    // Devolve o foco e posiciona o cursor após a inserção
    requestAnimationFrame(() => {
      ta.focus();
      ta.selectionStart = ta.selectionEnd = ini + novoTrecho.length;
    });
  };

  const Botao = ({ titulo, onClick, children }: { titulo: string; onClick: () => void; children: React.ReactNode }) => (
    <button type="button" title={titulo} onClick={onClick}
      className="w-9 h-9 flex items-center justify-center rounded-lg text-muted hover:text-secondary hover:bg-secondary/10 transition-colors">
      {children}
    </button>
  );

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-background">
      {/* Barra de ferramentas */}
      <div className="flex items-center gap-1 flex-wrap border-b border-border px-2 py-1 bg-surface/50">
        <Botao titulo="Negrito" onClick={() => aplicar("**", "**")}><FormatBoldIcon fontSize="small" /></Botao>
        <Botao titulo="Itálico" onClick={() => aplicar("*", "*")}><FormatItalicIcon fontSize="small" /></Botao>
        <Botao titulo="Título" onClick={() => aplicar("## ", "", true)}><TitleIcon fontSize="small" /></Botao>
        <Botao titulo="Lista" onClick={() => aplicar("- ", "", true)}><FormatListBulletedIcon fontSize="small" /></Botao>
        <Botao titulo="Citação" onClick={() => aplicar("> ", "", true)}><FormatQuoteIcon fontSize="small" /></Botao>
        <Botao titulo="Link" onClick={() => aplicar("[", "](https://)")}><LinkIcon fontSize="small" /></Botao>
        <div className="flex-1" />
        <button type="button" onClick={() => setPreview(p => !p)}
          className="flex items-center gap-1 px-3 h-9 rounded-lg text-xs font-bold text-secondary hover:bg-secondary/10 transition-colors">
          {preview ? <><EditNoteIcon fontSize="small" /> Editar</> : <><VisibilityIcon fontSize="small" /> Prévia</>}
        </button>
      </div>

      {preview ? (
        <div className="px-4 py-3 min-h-[16rem] prose prose-invert max-w-none text-sm">
          {value.trim()
            ? <ReactMarkdown>{value}</ReactMarkdown>
            : <p className="text-muted italic">Nada para pré-visualizar ainda.</p>}
        </div>
      ) : (
        <textarea
          ref={ref}
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className="w-full bg-transparent px-4 py-3 text-text outline-none resize-y text-sm leading-relaxed"
        />
      )}
    </div>
  );
}
