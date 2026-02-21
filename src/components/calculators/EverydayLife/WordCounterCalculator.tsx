import React, { useState, useEffect } from 'react';
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import useFaqJsonLd from '@/hooks/useFaqJsonLd';
import { Type, Hash, AlignLeft, Clock, BookOpen, Volume2, SplitSquareHorizontal, RefreshCw, Copy, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

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
        privacyText: "Everything is processed directly in your browser. No text data is ever sent to or stored on our servers."
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
        privacyText: "Tudo é processado diretamente no seu navegador. Nenhum texto é enviado ou armazenado em nossos servidores."
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
    return TRANSLATIONS[lang as keyof typeof TRANSLATIONS][key] || TRANSLATIONS['en-US'][key] || String(key);
};

const WordCounterCalculator = () => {
    const [text, setText] = useState('');
    const [copied, setCopied] = useState(false);

    const [stats, setStats] = useState({
        words: 0,
        chars: 0,
        charsNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        readingTime: 0,
        speakingTime: 0,
        avgWordLength: 0
    });

    useEffect(() => {
        analyzeText(text);
    }, [text]);

    const analyzeText = (val: string) => {
        const trimmedVal = val.trim();
        const chars = val.length;
        const charsNoSpaces = val.replace(/\s/g, '').length;

        // Words
        const wordsArray = trimmedVal ? val.match(/\b\w+\b/g) : null;
        const words = wordsArray ? wordsArray.length : 0;

        // Sentences
        const sentencesArray = trimmedVal ? val.match(/[^.!?]+[.!?]+/g) : null;
        // Fall back to 1 if there's text but no punctuation
        const sentences = sentencesArray ? sentencesArray.length : (trimmedVal ? 1 : 0);

        // Paragraphs
        const paragraphsArray = trimmedVal ? val.split(/\n+/).filter(p => p.trim() !== '') : null;
        const paragraphs = paragraphsArray ? paragraphsArray.length : 0;

        // Reading time (approx 238 words per minute)
        const readingTime = Math.ceil(words / 238);

        // Speaking time (approx 183 words per minute)
        const speakingTime = Math.ceil(words / 183);

        // Avg word length
        const avgWordLength = words > 0 ? (charsNoSpaces / words).toFixed(1) : 0;

        setStats({
            words,
            chars,
            charsNoSpaces,
            sentences,
            paragraphs,
            readingTime,
            speakingTime,
            avgWordLength: Number(avgWordLength)
        });
    };

    const handleClear = () => {
        setText('');
    };

    const handleCopy = async () => {
        if (stats.words === 0) return;
        try {
            const summary = `Word Count: ${stats.words}
Characters: ${stats.chars}
Characters (no spaces): ${stats.charsNoSpaces}
Sentences: ${stats.sentences}
Paragraphs: ${stats.paragraphs}
Reading Time: ~${stats.readingTime} min
Speaking Time: ~${stats.speakingTime} min`;
            await navigator.clipboard.writeText(summary);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const widget = (
        <div className="calculator-safe-zone space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* LEFT COLUMN: Input Area */}
                <div className="lg:col-span-8 space-y-6">
                    <Card className="border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
                        <CardHeader className="px-8 py-6 border-b border-slate-100 dark:border-slate-800/50">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl font-bold flex items-center gap-2.5 text-slate-900 dark:text-slate-50">
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg">
                                        <AlignLeft className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    Text Input
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" onClick={handleClear} className="text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors hidden sm:flex">
                                        <RefreshCw className="w-4 h-4 mr-2" /> {t('clearText')}
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder={t('enterText')}
                                className="w-full min-h-[350px] md:min-h-[450px] p-8 border-0 bg-transparent text-lg resize-none focus-visible:ring-0 focus-visible:ring-offset-0 leading-relaxed text-slate-700 dark:text-slate-200"
                                spellCheck={false}
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
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
                                        <Type className="w-4 h-4 text-blue-500" />
                                        <span className="text-xs font-semibold uppercase">{t('wordCount')}</span>
                                    </div>
                                    <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">{stats.words.toLocaleString()}</div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
                                        <Hash className="w-4 h-4 text-purple-500" />
                                        <span className="text-xs font-semibold uppercase">{t('charCount')}</span>
                                    </div>
                                    <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">{stats.chars.toLocaleString()}</div>
                                </div>
                            </div>

                            {/* Secondary Stats list */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                        <Hash className="w-3.5 h-3.5" /> {t('charNoSpaces')}
                                    </span>
                                    <span className="font-semibold text-slate-700 dark:text-slate-200">{stats.charsNoSpaces.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                        <SplitSquareHorizontal className="w-3.5 h-3.5" /> {t('sentenceCount')}
                                    </span>
                                    <span className="font-semibold text-slate-700 dark:text-slate-200">{stats.sentences.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                        <BookOpen className="w-3.5 h-3.5" /> {t('paragraphCount')}
                                    </span>
                                    <span className="font-semibold text-slate-700 dark:text-slate-200">{stats.paragraphs.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5" /> {t('readingTime')}
                                    </span>
                                    <span className="font-semibold text-slate-700 dark:text-slate-200">~{stats.readingTime} min</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                        <Volume2 className="w-3.5 h-3.5" /> {t('speakingTime')}
                                    </span>
                                    <span className="font-semibold text-slate-700 dark:text-slate-200">~{stats.speakingTime} min</span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                        <Type className="w-3.5 h-3.5" /> {t('avgWordLength')}
                                    </span>
                                    <span className="font-semibold text-slate-700 dark:text-slate-200">{stats.avgWordLength} chars</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Privacy Note */}
                    <div className="px-6 py-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 flex items-start gap-4">
                        <div className="mt-0.5 p-1.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
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
        { question: 'How is reading time calculated?', answer: 'Reading time is calculated based on an average adult reading speed of 238 words per minute. Speaking time assumes an average presentation speed of 183 words per minute.' },
        { question: 'Does it count spaces as characters?', answer: 'We provide two separate counts: one that includes spaces, and another "Characters (no spaces)" metric that ignores all whitespace.' },
    ];

    const faqJsonLd = useFaqJsonLd(faqs);

    const editorial = (
        <div className="space-y-8 skn-editorial-sections">
            <section id="why-use">
                <h2 className="text-2xl font-semibold">Why Use a Word Counter?</h2>
                <p className="mt-2">
                    Whether you are writing an essay, a blog post, social media content, or marketing material, keeping track of your text metrics is essential. Knowing your word and character count helps ensure you meet tight limits (like Twitter's 280 characters), optimize meta titles or descriptions for SEO, and avoid unnecessarily lengthy emails.
                </p>
            </section>
            <section id="features">
                <h2 className="text-2xl font-semibold">Features Include:</h2>
                <ul className="list-disc ml-6 mt-2 space-y-2">
                    <li><strong>Real-time Tracking:</strong> See your word, character, and sentence counts update instantly as you type.</li>
                    <li><strong>Reading & Speaking Time:</strong> Important for preparing speeches or estimating how long it takes an average user to read your article.</li>
                    <li><strong>Easy Copy Functionality:</strong> Copy your statistics with a single click.</li>
                    <li><strong>100% Secure:</strong> Our tool performs analyzing client-side. No data is sent over the internet.</li>
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
                    name: "Word Counter Utility",
                    applicationCategory: "Utility",
                    operatingSystem: "All",
                    description: "Count words, characters, sentences, and get reading time estimates.",
                },
                {
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    itemListElement: [
                        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.smartkitnow.com/" },
                        { "@type": "ListItem", position: 2, name: "Everyday Life", item: "https://www.smartkitnow.com/everyday" },
                        { "@type": "ListItem", position: 3, name: "Word Counter Calculator", item: "https://www.smartkitnow.com/everyday-life/word-counter" }
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
                { title: 'QR Code Generator', url: '/everyday-life/qr-code-generator', icon: '📱' },
                { title: 'Password Generator', url: '/everyday-life/password-generator', icon: '🔑' }
            ]}
        />
    );
};

export default WordCounterCalculator;
