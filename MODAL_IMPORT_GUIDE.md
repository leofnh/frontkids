# Modal de Importação Atualizado - Guia de Uso

## 🚀 Funcionalidades Implementadas

### 📊 **Detecção Automática de Arquivo**

- **Arquivos pequenos** (< 2MB): Modo padrão com batch processing
- **Arquivos grandes** (≥ 2MB): Sugestão automática do modo de progresso

### 🎯 **Dois Modos de Importação**

#### 1. **Modo Rápido** (Padrão)

- **API**: `POST /api/import/products/`
- **Uso**: Arquivos até 2MB (~1000 produtos)
- **Características**:
  - Processamento em lotes de 50 produtos
  - Feedback de estatísticas ao final
  - Mais rápido para arquivos pequenos

#### 2. **Modo com Progresso**

- **API**: `POST /api/import/products/progress/`
- **Uso**: Arquivos grandes (>2MB)
- **Características**:
  - Processamento em chunks de 20 produtos
  - Progresso visual em tempo real
  - Ideal para arquivos com milhares de produtos

### 🎨 **Interface Melhorada**

#### **Feedback Visual:**

```tsx
// Barra de progresso em tempo real
<div className="bg-green-500 h-2 rounded-full"
     style={{ width: `${progress.percentage}%` }}>
</div>

// Estatísticas em cards
- Produtos Criados: 150
- Produtos Atualizados: 25
- Erros: 2
```

#### **Seleção de Modo:**

```tsx
// Detecção automática baseada no tamanho
const fileSizeMB = file.size / (1024 * 1024);
if (fileSizeMB > 2) {
  setUseProgressMode(true);
}

// Interface para alternar modo
<button onClick={() => setUseProgressMode(false)}>
  Modo Rápido
</button>
<button onClick={() => setUseProgressMode(true)}>
  Com Progresso
</button>
```

## 🔧 **Como Usar no Frontend**

### **1. Importação Padrão (Recomendada)**

```javascript
// Função sendFileStandard
const response = await api.post("api/import/products/", formData);
const result = response.data;

// Retorno com estatísticas
{
  "status": "sucesso",
  "msg": "Importação concluída! 150 criados, 25 atualizados.",
  "statistics": {
    "created": 150,
    "updated": 25,
    "errors": 0,
    "total_processed": 175
  },
  "dados": [/* produtos formatados */]
}
```

### **2. Importação com Progresso**

```javascript
// Função sendFileWithProgress
const response = await fetch("/api/import/products/progress/", {
  method: "POST",
  body: formData,
});

// Leitura de stream
const reader = response.body?.getReader();
while (reading) {
  const { done, value } = await reader.read();
  const chunk = new TextDecoder().decode(value);

  // Parse de eventos Server-Sent
  if (line.startsWith("data: ")) {
    const data = JSON.parse(line.substring(6));

    if (data.status === "progresso") {
      setProgress(data.progress);
    }
  }
}
```

### **3. Estados do Componente**

```tsx
// Estados principais
const [fileX, setFile] = useState<File | null>(null);
const [loading, setLoading] = useState(false);
const [useProgressMode, setUseProgressMode] = useState(false);

// Estado de progresso
const [progress, setProgress] = useState<{
  processed: number;
  total: number;
  percentage: number;
  created: number;
  updated: number;
  errors: number;
  status: string;
} | null>(null);
```

## 📱 **UX/UI Melhorias**

### **Feedback Visual:**

- ✅ **Detecção automática**: Modo sugerido com base no tamanho
- ✅ **Progress bar**: Barra de progresso animada
- ✅ **Estatísticas em tempo real**: Cards com contadores
- ✅ **Códigos de cor**: Verde (criados), Azul (atualizados), Vermelho (erros)
- ✅ **Botões dinâmicos**: Ícones e textos mudam conforme o modo

### **Validações:**

- ✅ **Formato de arquivo**: Apenas .xlsx aceito
- ✅ **Tamanho do arquivo**: Sugestão automática de modo
- ✅ **Feedback de erros**: Mensagens específicas para cada tipo de erro
- ✅ **Estado de carregamento**: Botões desabilitados durante importação

## 🔄 **Fluxo de Uso**

1. **Seleção de Arquivo**:

   ```
   Usuário seleciona .xlsx → Validação → Detecção de tamanho → Sugestão de modo
   ```

2. **Configuração** (se arquivo grande):

   ```
   Exibição de opções → Usuário escolhe modo → Interface se adapta
   ```

3. **Importação**:

   ```
   Modo Rápido: Batch processing → Estatísticas finais
   Modo Progresso: Streaming → Progresso em tempo real
   ```

4. **Finalização**:
   ```
   Sucesso: Atualizar lista de produtos → Fechar modal
   Erro: Exibir mensagem → Manter modal aberto
   ```

## 🎯 **Vantagens da Implementação**

- ✅ **Compatibilidade**: Funciona com código existente
- ✅ **Performance**: Otimizado para diferentes tamanhos de arquivo
- ✅ **UX**: Interface intuitiva com feedback visual
- ✅ **Robustez**: Tratamento de erros e recovery automático
- ✅ **Escalabilidade**: Suporta desde dezenas até milhares de produtos

## 🚨 **Configurações Recomendadas**

| Tamanho do Arquivo | Modo Recomendado | Batch/Chunk Size | Tempo Estimado |
| ------------------ | ---------------- | ---------------- | -------------- |
| < 500 KB           | Rápido           | 50 produtos      | 2-5 segundos   |
| 500KB - 2MB        | Rápido           | 30 produtos      | 5-15 segundos  |
| > 2MB              | Com Progresso    | 20 produtos      | 15-60 segundos |
