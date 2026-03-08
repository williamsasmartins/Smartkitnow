import React, { useState, useEffect, useRef, useCallback } from 'react';
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import useFaqJsonLd from '@/hooks/useFaqJsonLd';
import {
    Type, Hash, AlignLeft, Clock, BookOpen, Volume2, SplitSquareHorizontal,
    RefreshCw, Copy, Check, Save, Download, Printer, Mic, Upload,
    Undo, Redo, Target, Wand2, Search, Timer, FileText, Cloud, Book, Languages, FileDown
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { jsPDF } from 'jspdf';
import { Switch } from '@/components/ui/switch';

const TRANSLATIONS = {
    "en-US": {
        appTitle: "Word Counter Utility",
        appDescription: "A fast, minimal, and clean tool to count words, characters, sentences, and paragraphs in real-time. Optimize your content for SEO and readability effortlessly.",
        enterText: "Type or paste your text here...",
        clearText: "Clear Text",
        copyText: "Copy Results",
        copied: "Copied!",
        wordCount: "Words",
        charCount: "Characters",
        charNoSpaces: "Characters (no spaces)",
        sentenceCount: "Sentences",
        paragraphCount: "Paragraphs",
        readingTime: "Reading Time",
        speakingTime: "Speaking Time",
        avgWordLength: "Avg Word Length",
        textAnalysis: "Text Analysis",
        privateSecure: "Private & Secure",
        privacyText: "Everything is processed directly in your browser. No text data is ever sent to or stored on our servers.",
        textCase: "Toggle Case",
        cleanText: "Clean Text",
        findReplace: "Find & Replace",
        setGoal: "Set Goal",
        undo: "Undo",
        redo: "Redo",
        proofRead: "Proof Read",
        talkToType: "Talk to Type",
        thesaurus: "Thesaurus",
        save: "Save (Local)",
        saveDrive: "Save to Drive",
        spellCheck: "Spell Check",
        speed: "Typing Speed",
        print: "Print",
        download: "Download",
        upload: "Upload Text",
        autoSave: "Auto-Save"
    },
    "pt-BR": {
        appTitle: "Contador de Palavras",
        appDescription: "Uma ferramenta rápida, minimalista e limpa para contar palavras, caracteres, frases e parágrafos em tempo real. Otimize seu conteúdo para SEO e legibilidade sem esforço.",
        enterText: "Digite ou cole seu texto aqui...",
        clearText: "Limpar Texto",
        copyText: "Copiar Resultados",
        copied: "Copiado!",
        wordCount: "Palavras",
        charCount: "Caracteres",
        charNoSpaces: "Caracteres (sem espaços)",
        sentenceCount: "Frases",
        paragraphCount: "Parágrafos",
        readingTime: "Tempo de Leitura",
        speakingTime: "Tempo de Fala",
        avgWordLength: "Tamanho Médio da Palavra",
        textAnalysis: "Análise de Texto",
        privateSecure: "Privado e Seguro",
        privacyText: "Tudo é processado diretamente no seu navegador. Nenhum texto é enviado ou armazenado em nossos servidores.",
        textCase: "Alternar Caixa",
        cleanText: "Limpar Texto",
        findReplace: "Procurar e Substituir",
        setGoal: "Definir Meta",
        undo: "Desfazer",
        redo: "Refazer",
        proofRead: "Revisar/Ler",
        talkToType: "Falar para Digitar",
        thesaurus: "Dicionário",
        save: "Salvar (Local)",
        saveDrive: "Salvar no Drive",
        spellCheck: "Verificar Ortografia",
        speed: "Velocidade Média",
        print: "Imprimir",
        download: "Baixar",
        upload: "Carregar Texto",
        autoSave: "Salvar Automático"
    }
};

const getLang = () => {
    if (typeof window === 'undefined') return 'en-US';
    const path = window.location.pathname;
    if (path.includes('/pt/')) return 'pt-BR';
    const navLang = navigator.language;
    if (navLang.startsWith('pt')) return 'pt-BR';
    return 'en-US';
};

const t = (key: keyof typeof TRANSLATIONS['en-US']) => {
    const lang = getLang();
    return TRANSLATIONS[lang as keyof typeof TRANSLATIONS]?.[key] || TRANSLATIONS['en-US'][key] || String(key);
};

// Undo/Redo Hook
const useHistory = (initialState: string) => {
    const [state, setState] = useState(initialState);
    const [history, setHistory] = useState<string[]>([initialState]);
    const [pointer, setPointer] = useState(0);

    const set = useCallback((val: string) => {
        setState(val);
        const newHistory = [...history.slice(0, pointer + 1), val];
        // Keep max 50 states to prevent memory issues
        if (newHistory.length > 50) newHistory.shift();
        setHistory(newHistory);
        setPointer(newHistory.length - 1);
    }, [history, pointer]);

    const undo = useCallback(() => {
        if (pointer > 0) {
            setPointer(pointer - 1);
            setState(history[pointer - 1]);
        }
    }, [history, pointer]);

    const redo = useCallback(() => {
        if (pointer < history.length - 1) {
            setPointer(pointer + 1);
            setState(history[pointer + 1]);
        }
    }, [history, pointer]);

    return { state, set, undo, redo, canUndo: pointer > 0, canRedo: pointer < history.length - 1 };
};

const WordCounterCalculator = () => {
    const { state: text, set: setText, undo, redo, canUndo, canRedo } = useHistory('');
    const [copied, setCopied] = useState(false);

    // Stats
    const [stats, setStats] = useState({
        words: 0, chars: 0, charsNoSpaces: 0, sentences: 0, paragraphs: 0, readingTime: 0, speakingTime: 0, avgWordLength: 0
    });

    // Feature Toggles & States
    const [autoSave, setAutoSave] = useState(false);
    const [spellCheck, setSpellCheck] = useState(false);
    const [showFindReplace, setShowFindReplace] = useState(false);
    const [showGoal, setShowGoal] = useState(false);
    const [findText, setFindText] = useState('');
    const [replaceText, setReplaceText] = useState('');
    const [goalWords, setGoalWords] = useState<number | null>(null);

    // Speed Tracker
    const [typingSpeed, setTypingSpeed] = useState(0);
    const startTimeRef = useRef<number | null>(null);
    const lastWordCountRef = useRef(0);

    // Audio / Mic Refs
    const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
    const recognitionRef = useRef<any>(null);
    const [isDictating, setIsDictating] = useState(false);
    const [isReading, setIsReading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize Speech Synthesizer on mount if available
    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            synthesisRef.current = new SpeechSynthesisUtterance();
            synthesisRef.current.onend = () => setIsReading(false);
        }

        // Load local save
        const saved = localStorage.getItem('wc-saved-draft');
        if (saved) setText(saved);

        // Speed Tracking Interval (checks WPM occasionally)
        const interval = setInterval(() => {
            if (startTimeRef.current && stats.words > 0) {
                const minutes = (Date.now() - startTimeRef.current) / 60000;
                if (minutes > 0.1) {
                    setTypingSpeed(Math.round(stats.words / minutes));
                }
            }
        }, 5000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Text analysis main effect
    useEffect(() => {
        const trimmedVal = text.trim();
        const chars = text.length;
        const charsNoSpaces = text.replace(/\s/g, '').length;
        const wordsArray = trimmedVal ? text.match(/\b\w+\b/g) : null;
        const words = wordsArray ? wordsArray.length : 0;
        const sentencesArray = trimmedVal ? text.match(/[^.!?]+[.!?]+/g) : null;
        const sentences = sentencesArray ? sentencesArray.length : (trimmedVal ? 1 : 0);
        const paragraphsArray = trimmedVal ? text.split(/\n+/).filter(p => p.trim() !== '') : null;
        const paragraphs = paragraphsArray ? paragraphsArray.length : 0;
        const readingTime = Math.ceil(words / 238);
        const speakingTime = Math.ceil(words / 183);
        const avgWordLength = words > 0 ? (charsNoSpaces / words).toFixed(1) : 0;

        setStats({
            words, chars, charsNoSpaces, sentences, paragraphs, readingTime, speakingTime, avgWordLength: Number(avgWordLength)
        });

        if (words > 0 && !startTimeRef.current) {
            startTimeRef.current = Date.now();
        }
        if (words === 0) {
            startTimeRef.current = null;
            setTypingSpeed(0);
        }
    }, [text]);

    // Auto-Save Effect
    useEffect(() => {
        let timer: any;
        if (autoSave && text) {
            timer = setInterval(() => {
                localStorage.setItem('wc-auto-save', text);
            }, 30000);
        }
        return () => clearInterval(timer);
    }, [autoSave, text]);


    /* ---- Toolbar Handlers ---- */

    const handleClear = () => { if (confirm("Clear all text?")) setText(''); };

    const handleCaseCycle = () => {
        if (!text) return;
        const cases = ['lower', 'upper', 'sentence', 'title'];
        const next = text === text.toLowerCase() ? 'upper' : text === text.toUpperCase() ? 'title' : 'lower';

        if (next === 'upper') setText(text.toUpperCase());
        else if (next === 'lower') setText(text.toLowerCase());
        else if (next === 'title') {
            setText(text.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase()));
        }
    };

    const handleCleanText = () => {
        setText(text.replace(/\s+/g, ' ').replace(/\n\s*\n/g, '\n\n').trim());
    };

    const handleManualSave = () => {
        localStorage.setItem('wc-saved-draft', text);
        alert('Document saved to local storage.');
    };

    const handeDriveSave = () => {
        // Simulated Drive API call
        alert('Connecting to Google Drive... (Simulated feature)');
    };

    const handleFindReplace = () => {
        if (findText && replaceText) {
            setText(text.split(findText).join(replaceText));
        }
    };

    const handleDownload = (format: 'txt' | 'doc' | 'pdf') => {
        if (!text) return alert("Write some text to download.");
        if (format === 'txt' || format === 'doc') {
            const type = format === 'doc' ? 'application/msword' : 'text/plain';
            const blob = new Blob([text], { type });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `document.${format}`;
            a.click();
        } else if (format === 'pdf') {
            try {
                const doc = new jsPDF();
                doc.text(text, 10, 10, { maxWidth: 190 });
                doc.save('document.pdf');
            } catch (e) {
                alert("Failed to generate PDF. Check if jsPDF loaded correctly.");
            }
        }
    };

    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=600,width=800');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Print Document</title>');
            printWindow.document.write('<style>body { font-family: sans-serif; white-space: pre-wrap; padding: 2em; line-height: 1.6;}</style>');
            printWindow.document.write('</head><body >');
            printWindow.document.write(text);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    };

    const handleProofRead = () => {
        if (!('speechSynthesis' in window)) return alert('Not supported in your browser');
        if (isReading) {
            window.speechSynthesis.cancel();
            setIsReading(false);
        } else {
            if (synthesisRef.current && text) {
                synthesisRef.current.text = text;
                window.speechSynthesis.speak(synthesisRef.current);
                setIsReading(true);
            }
        }
    };

    const handleTalkToType = () => {
        if (isDictating && recognitionRef.current) {
            recognitionRef.current.stop();
            setIsDictating(false);
            return;
        }
        const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRec) return alert('Speech recognition not supported in your browser');

        recognitionRef.current = new SpeechRec();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (e: any) => {
            let currentResult = '';
            for (let i = e.resultIndex; i < e.results.length; i++) {
                if (e.results[i].isFinal) currentResult += e.results[i][0].transcript;
            }
            if (currentResult) setText(text + (text ? ' ' : '') + currentResult);
        };

        recognitionRef.current.onerror = () => setIsDictating(false);
        recognitionRef.current.onend = () => setIsDictating(false);

        recognitionRef.current.start();
        setIsDictating(true);
    };

    const handleThesaurus = () => {
        // Simulate getting selected text to thesaurus.com
        const selected = window.getSelection()?.toString().trim();
        if (selected && selected.split(' ').length === 1) {
            window.open(`https://www.thesaurus.com/browse/${selected}`, '_blank');
        } else {
            alert("Highlight a single word first, then click Thesaurus to view synonyms.");
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) setText(e.target.result as string);
            };
            reader.readAsText(file);
        }
    };

    const handleCopy = async () => {
        if (stats.words === 0) return;
        try {
            const summary = `Word Count: ${stats.words} | Characters: ${stats.chars} | Reading Time: ~${stats.readingTime} min\n---\n${text}`;
            await navigator.clipboard.writeText(summary);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) { }
    };

    // UI Components
    const ToolbarButton = ({ onClick, icon: Icon, label, title, active, disabled }: any) => (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClick}
                    disabled={disabled}
                    className={`p-2 h-9 w-9 rounded-md transition-all ${active ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                    <Icon className="w-4 h-4" />
                </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-900 text-white text-xs">{title || label}</TooltipContent>
        </Tooltip>
    );

    const widget = (
        <div className="calculator-safe-zone space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* LEFT COLUMN: Input Area */}
                <div className="lg:col-span-8 space-y-6">
                    <Card className="border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">

                        {/* RICH TOOLBAR */}
                        <CardHeader className="px-4 md:px-6 py-3 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50">
                            <TooltipProvider>
                                <div className="flex flex-wrap items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {/* History Group */}
                                    <div className="flex items-center space-x-1 border-r border-slate-200 dark:border-slate-800 pr-2 pb-1 md:pb-0">
                                        <ToolbarButton icon={Undo} onClick={undo} disabled={!canUndo} title={t('undo')} />
                                        <ToolbarButton icon={Redo} onClick={redo} disabled={!canRedo} title={t('redo')} />
                                    </div>

                                    {/* Action Group */}
                                    <div className="flex items-center space-x-1 border-r border-slate-200 dark:border-slate-800 pr-2 pb-1 md:pb-0">
                                        <ToolbarButton icon={FileDown} onClick={() => handleDownload('txt')} title={t('download')} />
                                        <ToolbarButton icon={Printer} onClick={handlePrint} title={t('print')} />
                                        <ToolbarButton icon={Upload} onClick={() => fileInputRef.current?.click()} title={t('upload')} />
                                        <input type="file" accept=".txt,.doc,.docx" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                                    </div>

                                    {/* Format Group */}
                                    <div className="flex items-center space-x-1 border-r border-slate-200 dark:border-slate-800 pr-2 pb-1 md:pb-0">
                                        <ToolbarButton icon={Type} onClick={handleCaseCycle} title={t('textCase')} />
                                        <ToolbarButton icon={Wand2} onClick={handleCleanText} title={t('cleanText')} />
                                        <ToolbarButton icon={Languages} onClick={() => setSpellCheck(!spellCheck)} active={spellCheck} title={t('spellCheck')} />
                                        <ToolbarButton icon={Book} onClick={handleThesaurus} title={t('thesaurus')} />
                                    </div>

                                    {/* Speech Group */}
                                    <div className="flex items-center space-x-1 border-r border-slate-200 dark:border-slate-800 pr-2 pb-1 md:pb-0">
                                        <ToolbarButton icon={Volume2} onClick={handleProofRead} active={isReading} title={t('proofRead')} />
                                        <ToolbarButton icon={Mic} onClick={handleTalkToType} active={isDictating} title={t('talkToType')} />
                                    </div>

                                    {/* View Controls Group */}
                                    <div className="flex items-center space-x-1 border-r border-slate-200 dark:border-slate-800 pr-2 pb-1 md:pb-0">
                                        <ToolbarButton icon={Search} onClick={() => setShowFindReplace(!showFindReplace)} active={showFindReplace} title={t('findReplace')} />
                                        <ToolbarButton icon={Target} onClick={() => setShowGoal(!showGoal)} active={showGoal} title={t('setGoal')} />
                                    </div>

                                    {/* Save Group */}
                                    <div className="flex items-center space-x-1 border-slate-200 dark:border-slate-800 pb-1 md:pb-0">
                                        <ToolbarButton icon={Save} onClick={handleManualSave} title={t('save')} />
                                        <ToolbarButton icon={Cloud} onClick={handeDriveSave} title={t('saveDrive')} />
                                        <Button variant="ghost" size="sm" onClick={handleClear} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 px-2 ml-1" title={t('clearText')}>
                                            <RefreshCw className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </TooltipProvider>

                            {/* Optional Panels below toolbar */}
                            {showFindReplace && (
                                <div className="flex gap-2 items-center mt-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-lg animate-in slide-in-from-top-2">
                                    <Search className="w-4 h-4 text-slate-400 ml-2" />
                                    <Input value={findText} onChange={e => setFindText(e.target.value)} placeholder="Find..." className="h-8 text-sm max-w-[150px]" />
                                    <Input value={replaceText} onChange={e => setReplaceText(e.target.value)} placeholder="Replace with..." className="h-8 text-sm max-w-[150px]" />
                                    <Button size="sm" onClick={handleFindReplace} className="h-8 shadow-sm">Replace All</Button>
                                </div>
                            )}

                            {showGoal && (
                                <div className="flex items-center gap-4 mt-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-lg animate-in slide-in-from-top-2">
                                    <Target className="w-4 h-4 text-slate-400" />
                                    <Label className="text-sm font-semibold whitespace-nowrap">Word Goal:</Label>
                                    <Input type="number" value={goalWords || ''} onChange={(e) => setGoalWords(Number(e.target.value))} className="h-8 w-24 text-sm" placeholder="e.g. 500" />
                                    {goalWords ? (
                                        <div className="w-full flex items-center gap-3 ml-2 pr-2">
                                            <div className="h-2 flex-grow bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${Math.min((stats.words / goalWords) * 100, 100)}%` }} />
                                            </div>
                                            <span className="text-xs font-bold text-slate-500">{stats.words}/{goalWords}</span>
                                        </div>
                                    ) : null}
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className="p-0 relative">
                            <Textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder={t('enterText')}
                                className="w-full min-h-[350px] md:min-h-[450px] p-6 md:p-8 border-0 bg-transparent text-lg resize-y focus-visible:ring-0 focus-visible:ring-offset-0 leading-relaxed text-slate-700 dark:text-slate-200 custom-scrollbar rounded-none font-medium"
                                spellCheck={spellCheck}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COLUMN: Results & Analysis */}
                <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-6">
                    <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl rounded-3xl overflow-hidden pt-2">
                        <CardHeader className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/50">
                            <CardTitle className="text-base font-bold flex items-center justify-between text-slate-900 dark:text-slate-100 uppercase tracking-widest">
                                <span>{t('textAnalysis')}</span>
                                <Button variant="ghost" size="icon" onClick={handleCopy} title={t('copyText')} className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/40">
                                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {/* Primary Stats */}
                            <div className="flex flex-col gap-4 mb-6">
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 sm:p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
                                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
                                        <Type className="w-5 h-5 text-blue-500" />
                                        <span className="text-sm font-bold uppercase tracking-widest">{t('wordCount')}</span>
                                    </div>
                                    <div className={`text-4xl sm:text-5xl font-extrabold truncate w-full ${goalWords && stats.words >= goalWords ? 'text-green-600 dark:text-green-400' : 'text-slate-800 dark:text-slate-100'}`}>
                                        {stats.words.toLocaleString()}
                                    </div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 sm:p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
                                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
                                        <Hash className="w-5 h-5 text-purple-500" />
                                        <span className="text-sm font-bold uppercase tracking-widest">{t('charCount')}</span>
                                    </div>
                                    <div className="text-4xl sm:text-5xl font-extrabold text-slate-800 dark:text-slate-100 truncate w-full">
                                        {stats.chars.toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            {/* Secondary Stats list */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 px-2 rounded-md transition-colors">
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                        <Hash className="w-3.5 h-3.5" /> {t('charNoSpaces')}
                                    </span>
                                    <span className="font-semibold text-slate-700 dark:text-slate-200">{stats.charsNoSpaces.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 px-2 rounded-md transition-colors">
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                        <SplitSquareHorizontal className="w-3.5 h-3.5" /> {t('sentenceCount')}
                                    </span>
                                    <span className="font-semibold text-slate-700 dark:text-slate-200">{stats.sentences.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 px-2 rounded-md transition-colors">
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                        <BookOpen className="w-3.5 h-3.5" /> {t('paragraphCount')}
                                    </span>
                                    <span className="font-semibold text-slate-700 dark:text-slate-200">{stats.paragraphs.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 px-2 rounded-md transition-colors">
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5" /> {t('readingTime')}
                                    </span>
                                    <span className="font-semibold text-slate-700 dark:text-slate-200">~{stats.readingTime} min</span>
                                </div>

                                {typingSpeed > 0 && (
                                    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 px-2 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-md">
                                        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                                            <Timer className="w-3.5 h-3.5 animate-pulse" /> {t('speed')}
                                        </span>
                                        <span className="font-bold text-indigo-700 dark:text-indigo-300">{typingSpeed} WPM</span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between py-2 border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 px-2 rounded-md transition-colors">
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                        <FileText className="w-3.5 h-3.5" /> {t('avgWordLength')}
                                    </span>
                                    <span className="font-semibold text-slate-700 dark:text-slate-200">{stats.avgWordLength} chars/word</span>
                                </div>

                            </div>

                        </CardContent>
                    </Card>

                    {/* Configuration */}
                    <Card className="border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur shadow-sm rounded-2xl overflow-hidden mt-6">
                        <CardContent className="p-4 flex items-center justify-between">
                            <span className="text-sm font-semibold flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                <Save className="w-4 h-4 text-emerald-500" /> {t('autoSave')} (30s)
                            </span>
                            <Switch checked={autoSave} onCheckedChange={(v) => setAutoSave(v)} />
                        </CardContent>
                    </Card>

                    {/* Privacy Note */}
                    <div className="px-6 py-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 flex items-start gap-4">
                        <div className="mt-0.5 p-1.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg shadow-sm">
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <p className="text-xs text-emerald-800 dark:text-emerald-400 font-medium leading-relaxed">
                            <strong>{t('privateSecure')}:</strong> {t('privacyText')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    const faqs = [
        { question: 'Is this word counter free?', answer: 'Yes, this word counting tool is completely free to use without any limits.' },
        { question: 'Why is word count important for SEO?', answer: 'Word count can be an indicator of content depth. While there is no perfect word length, longer, comprehensive content often ranks better in search engines if it comprehensively answers user intent.' },
        { question: 'Do you store any of my text?', answer: 'No. All processing is done locally in your browser immediately. We don\'t send or save your text to any server. Your privacy is 100% guaranteed.' },
        { question: 'What formatting options are available?', answer: 'You can toggle casing, find and replace words, clean text margins, dictate voice to text, and verify spellings live.' },
    ];
    const faqJsonLd = useFaqJsonLd(faqs);

    const editorial = (
        <div className="space-y-8 skn-editorial-sections">
            <section id="why-use">
                <h2 className="text-2xl font-semibold">The Ultimate Word Tracker</h2>
                <p className="mt-2">
                    Whether you are writing an essay, a blog post, social media content, or marketing material, keeping track of your text metrics is essential. Our utility augments your writing process with a rich set of automated macros and analytics.
                </p>
            </section>
            <section id="features">
                <h2 className="text-2xl font-semibold">Features Include:</h2>
                <ul className="list-disc ml-6 mt-2 space-y-2">
                    <li><strong>Real-time Tracking & Speed:</strong> See your word, character, and typing speed update instantly as you go.</li>
                    <li><strong>Actionable Toolbars:</strong> Adjust cases, clear multiple whitespaces, and find/replace content.</li>
                    <li><strong>Text-to-Speech & Speech-to-Text:</strong> Read along with dynamic proofreading or use the mic to transcribe ideas simply.</li>
                    <li><strong>Goal Setting:</strong> Embed realistic writing targets right under the belt of your editor to gamify production.</li>
                    <li><strong>Downloads:</strong> Securely copy to clipboard, save as PDF or TXT, and store drafts inside your local workspace.</li>
                </ul>
            </section>
            <section id="seo">
                <h2 className="text-2xl font-semibold">Word Count and SEO Optimization</h2>
                <p className="mt-2">
                    In Search Engine Optimization (SEO), length can correlate with quality. Providing comprehensive coverage of a topic usually means a higher word count, satisfying user intent more effectively. Additionally, title tags typically max out at 60 characters and meta descriptions at 155-160 characters before search engines truncate them.
                </p>
            </section>
            <section id="faq">
                <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
                <div className="space-y-4 mt-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border-b border-slate-200 dark:border-slate-700 pb-4 last:border-0">
                            <h3 className="font-medium text-lg text-slate-900 dark:text-slate-100">{faq.question}</h3>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );

    return (
        <CalculatorVerticalLayout
            title={t('appTitle')}
            description={t('appDescription')}
            widget={widget}
            editorial={editorial}
            jsonLd={[
                faqJsonLd ?? undefined,
                {
                    "@context": "https://schema.org",
                    "@type": "WebApplication",
                    name: "Advanced Word Counter Utility",
                    applicationCategory: "Utility",
                    operatingSystem: "All",
                    description: "Count words, track speed, proofread, set goals and format texts.",
                    url: "https://www.smartkitnow.com/everyday/word-counter"
                },
                {
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    itemListElement: [
                        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.smartkitnow.com/" },
                        { "@type": "ListItem", position: 2, name: "Everyday Life", item: "https://www.smartkitnow.com/everyday" },
                        { "@type": "ListItem", position: 3, name: "Word Counter Utility", item: "https://www.smartkitnow.com/everyday/word-counter" }
                    ]
                }
            ].filter(Boolean)}
            onThisPage={[
                { id: 'why-use', label: 'Why Use a Word Counter?' },
                { id: 'features', label: 'Features' },
                { id: 'seo', label: 'SEO Optimization' },
                { id: 'faq', label: 'FAQs' },
            ]}
            relatedCalculators={[
                { title: 'QR Code Generator', url: '/everyday/qr-code-generator', icon: '📱' },
                { title: 'Password Generator', url: '/everyday/password-generator', icon: '🔑' }
            ]}
            contentMaxWidth="max-w-5xl"
            showSidebar={false}
        />
    );
};

export default WordCounterCalculator;
