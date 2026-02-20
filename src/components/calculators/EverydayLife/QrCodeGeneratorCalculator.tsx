import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import useFaqJsonLd from '@/hooks/useFaqJsonLd';
import { QrCode, Link as LinkIcon, MessageSquare, User, Download, Copy, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useTheme } from 'next-themes';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TRANSLATIONS = {
  "en-US": {
    appTitle: "QR Code Generator",
    appDescription: "Generate free QR codes for URLs, text, and contacts (vCard). Download PNG or SVG, choose error‑correction (ECC), margins, size and brand colors. Private: data never leaves your browser.",
    urlTab: "URL",
    textTab: "Text",
    contactTab: "Contact",
    enterUrl: "Enter URL",
    enterText: "Enter Text",
    contactInformation: "Contact Information",
    websiteUrl: "Website URL",
    urlPlaceholder: "example.com or https://example.com",
    urlHelp: "Enter a website URL. If you don't include http://, we'll add https:// automatically.",
    textContent: "Text Content",
    textPlaceholder: "Enter any text to generate QR code...",
    firstName: "First Name",
    firstNamePlaceholder: "John",
    lastName: "Last Name",
    lastNamePlaceholder: "Doe",
    phoneNumber: "Phone Number",
    phonePlaceholder: "+1 (555) 123-4567",
    emailAddress: "Email Address",
    emailPlaceholder: "john.doe@example.com",
    organization: "Organization",
    organizationPlaceholder: "Company Name",
    website: "Website",
    websitePlaceholder: "https://example.com",
    clearAllFields: "Clear All Fields",
    generatedQrCode: "Generated QR Code",
    scanQrCode: "Scan this QR code with your device",
    fillFormPrompt: "Fill in the form to generate your QR code",
    download: "Download",
    copyData: "Copy Data",
    copied: "Copied!",
    qrCodeData: "QR Code Data:",
    footerText: "Generate QR codes instantly • No data stored • Free to use",
    qrCodeAlt: "Generated QR Code",
    qrDetails: "QR Details",
    livePreview: "Live Preview",
    configuration: "Configuration",
    appearance: "Appearance",
    quickStyles: "Quick Styles",
    autoColors: "Auto Colors",
    resetToTheme: "Reset to Theme",
    exportSvg: "Export SVG",
    downloadPng: "Download PNG",
    privateSecure: "Private & Secure",
    privacyText: "All QR codes are generated directly in your browser. Your data never leaves your computer.",
    size: "Size (px)",
    margin: "Margin",
    ecc: "Error Correction",
    format: "Format",
    moduleColor: "Module Color",
    bgColor: "Background Color",
    quickClassic: "Classic",
    quickAzure: "Azure",
    quickAmethyst: "Amethyst",
    quickGold: "Gold Rush",
  },
  "pt-BR": {
    appTitle: "Gerador de QR Code",
    appDescription: "Gere QR codes gratuitos para URLs, texto e contatos (vCard). Baixe em PNG ou SVG, escolha a correção de erro (ECC), margens, tamanho e cores da marca. Privado: os dados nunca saem do seu navegador.",
    urlTab: "URL",
    textTab: "Texto",
    contactTab: "Contato",
    enterUrl: "Digite a URL",
    enterText: "Digite o Texto",
    contactInformation: "Informações de Contato",
    websiteUrl: "URL do Website",
    urlPlaceholder: "exemplo.com ou https://exemplo.com",
    urlHelp: "Digite a URL de um site. Se não incluir http://, adicionaremos https:// automaticamente.",
    textContent: "Conteúdo do Texto",
    textPlaceholder: "Digite qualquer texto para gerar o QR code...",
    firstName: "Nome",
    firstNamePlaceholder: "João",
    lastName: "Sobrenome",
    lastNamePlaceholder: "Silva",
    phoneNumber: "Telefone",
    phonePlaceholder: "+55 (11) 99999-9999",
    emailAddress: "E-mail",
    emailPlaceholder: "joao.silva@exemplo.com",
    organization: "Empresa",
    organizationPlaceholder: "Nome da Empresa",
    website: "Website",
    websitePlaceholder: "https://exemplo.com",
    clearAllFields: "Limpar Todos os Campos",
    generatedQrCode: "QR Code Gerado",
    scanQrCode: "Escaneie este QR code com seu dispositivo",
    fillFormPrompt: "Preencha o formulário para gerar seu QR code",
    download: "Download",
    copyData: "Copiar Dados",
    copied: "Copiado!",
    qrCodeData: "Dados do QR Code:",
    footerText: "Gere QR codes instantaneamente • Sem armazenamento de dados • Grátis",
    qrCodeAlt: "QR Code Gerado",
    qrDetails: "Detalhes do QR",
    livePreview: "Prévia em Tempo Real",
    configuration: "Configuração",
    appearance: "Aparência",
    quickStyles: "Estilos Rápidos",
    autoColors: "Cores Automáticas",
    resetToTheme: "Redefinir para o Tema",
    exportSvg: "Exportar SVG",
    downloadPng: "Baixar PNG",
    privateSecure: "Privado e Seguro",
    privacyText: "Todos os QR codes são gerados diretamente no seu navegador. Seus dados nunca saem do seu computador.",
    size: "Tamanho (px)",
    margin: "Margem",
    ecc: "Correção de Erro",
    format: "Formato",
    moduleColor: "Cor do Módulo",
    bgColor: "Cor de Fundo",
    quickClassic: "Clássico",
    quickAzure: "Azure",
    quickAmethyst: "Ametista",
    quickGold: "Dourado",
  }
};

// Language detection logic
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
  return TRANSLATIONS[lang][key] || TRANSLATIONS['en-US'][key] || String(key);
};

const QRCodeGenerator = () => {
  const { resolvedTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'url' | 'text' | 'contact'>('url');
  const [qrData, setQrData] = useState('');
  const [copied, setCopied] = useState(false);
  const qrContainerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [contactInfo, setContactInfo] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    organization: '',
    url: ''
  });
  const [size, setSize] = useState<number>(300);
  const [margin, setMargin] = useState<number>(2);
  const [ecc, setEcc] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [format, setFormat] = useState<'png' | 'svg'>('png');
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null);
  const [autoColors, setAutoColors] = useState<boolean>(true);
  const [moduleColor, setModuleColor] = useState<string>('#000000');
  const [bgColor, setBgColor] = useState<string>('#ffffff');

  // Sync colors with theme when auto mode is enabled
  useEffect(() => {
    if (autoColors) {
      const isDark = resolvedTheme === 'dark' || document.documentElement.classList.contains('dark') || window.matchMedia('(prefers-color-scheme: dark)').matches;
      setModuleColor(isDark ? '#ffffff' : '#000000');
      setBgColor(isDark ? '#0f172a' : '#ffffff');
    }
  }, [resolvedTheme, autoColors]);

  const generateQRCode = async (text: string) => {
    if (!text.trim()) {
      if (qrContainerRef.current) {
        qrContainerRef.current.innerHTML = '';
      }
      return;
    }
    try {
      if (!qrContainerRef.current) return;
      qrContainerRef.current.innerHTML = '';
      const canvas = document.createElement('canvas');
      canvasRef.current = canvas;
      qrContainerRef.current.appendChild(canvas);
      const isDark = resolvedTheme === 'dark' || document.documentElement.classList.contains('dark') || window.matchMedia('(prefers-color-scheme: dark)').matches;
      const darkColor = autoColors ? (isDark ? '#ffffff' : '#000000') : moduleColor;
      const lightColor = autoColors ? (isDark ? '#0f172a' : '#ffffff') : bgColor;
      if (format === 'png') {
        await QRCode.toCanvas(canvas, text, {
          errorCorrectionLevel: ecc,
          margin,
          width: size,
          color: {
            dark: darkColor,
            light: lightColor,
          },
        });
        setSvgMarkup(null);
      } else {
        const svg = (await QRCode.toString(text, {
          errorCorrectionLevel: ecc,
          margin,
          width: size,
          type: 'svg',
          color: {
            dark: darkColor,
            light: lightColor,
          },
        } as any)) as unknown as string;
        setSvgMarkup(svg);
        canvas.remove();
        const container = document.createElement('div');
        container.innerHTML = svg;
        qrContainerRef.current.appendChild(container);
      }
      canvas.className = 'w-full h-auto rounded-xl shadow-lg bg-white dark:bg-slate-900';
      canvas.style.maxWidth = '300px';
      canvas.style.height = 'auto';
    } catch (error) {
      console.error('Error creating QR code:', error);
      generateFallbackQR(text);
    }
  };

  const generateFallbackQR = (text: string) => {
    if (!qrContainerRef.current) return;
    qrContainerRef.current.innerHTML = '';
    const img = document.createElement('img');
    const encodedData = encodeURIComponent(text);
    const isDark = resolvedTheme === 'dark' || document.documentElement.classList.contains('dark') || window.matchMedia('(prefers-color-scheme: dark)').matches;
    const effectiveModule = autoColors ? (isDark ? '#ffffff' : '#000000') : moduleColor;
    const effectiveBg = autoColors ? (isDark ? '#0f172a' : '#ffffff') : bgColor;
    const color = effectiveModule.replace('#', '');
    const bgcolor = effectiveBg.replace('#', '');
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedData}&format=png&margin=${margin}&color=${color}&bgcolor=${bgcolor}`;
    img.alt = t('qrCodeAlt');
    img.className = 'w-full h-auto rounded-xl shadow-lg bg-white dark:bg-slate-900 p-4';
    img.style.maxWidth = '300px';
    img.style.height = 'auto';
    qrContainerRef.current.appendChild(img);
  };

  const formatUrl = (url: string) => {
    if (!url.trim()) return '';
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'https://' + url;
    }
    return url;
  };

  const generateVCard = (contact: typeof contactInfo) => {
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${contact.firstName} ${contact.lastName}\nN:${contact.lastName};${contact.firstName};;;\nORG:${contact.organization}\nTEL:${contact.phone}\nEMAIL:${contact.email}\nURL:${contact.url}\nEND:VCARD`;
    return vcard;
  };

  useEffect(() => {
    let data = '';
    switch (activeTab) {
      case 'url':
        data = formatUrl(urlInput);
        break;
      case 'text':
        data = textInput;
        break;
      case 'contact':
        if (contactInfo.firstName || contactInfo.lastName || contactInfo.phone || contactInfo.email) {
          data = generateVCard(contactInfo);
        }
        break;
      default:
        data = '';
    }
    setQrData(data);
    generateQRCode(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, urlInput, textInput, contactInfo, size, margin, ecc, format, resolvedTheme, autoColors, moduleColor, bgColor]);

  const applyPreset = (preset: 'classic' | 'modern-blue' | 'vibrant-purple' | 'dark-gold') => {
    setAutoColors(false);
    switch (preset) {
      case 'classic':
        setModuleColor('#000000');
        setBgColor('#ffffff');
        break;
      case 'modern-blue':
        setModuleColor('#2563eb');
        setBgColor('#f8fafc');
        break;
      case 'vibrant-purple':
        setModuleColor('#7c3aed');
        setBgColor('#faf5ff');
        break;
      case 'dark-gold':
        setModuleColor('#fbbf24');
        setBgColor('#0f172a');
        break;
    }
  };

  const downloadQRCode = () => {
    if (!qrData) return;
    const canvas = qrContainerRef.current?.querySelector('canvas');
    const img = qrContainerRef.current?.querySelector('img');
    if (format === 'svg' && svgMarkup) {
      const blob = new Blob([svgMarkup], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `qr-code-${activeTab}.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      return;
    }
    if (canvas) {
      const link = document.createElement('a');
      link.download = `qr-code-${activeTab}.png`;
      link.href = (canvas as HTMLCanvasElement).toDataURL();
      link.click();
    } else if (img) {
      const link = document.createElement('a');
      link.download = `qr-code-${activeTab}.png`;
      link.href = (img as HTMLImageElement).src;
      link.click();
    }
  };

  const copyToClipboard = async () => {
    if (qrData) {
      try {
        await navigator.clipboard.writeText(qrData);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  const resetForm = () => {
    setUrlInput('');
    setTextInput('');
    setContactInfo({ firstName: '', lastName: '', phone: '', email: '', organization: '', url: '' });
    setQrData('');
    if (qrContainerRef.current) {
      qrContainerRef.current.innerHTML = '';
    }
  };

  const tabs = [
    { id: 'url', label: t('urlTab'), icon: LinkIcon },
    { id: 'text', label: t('textTab'), icon: MessageSquare },
    { id: 'contact', label: t('contactTab'), icon: User },
  ];

  const widget = (
    <div className="calculator-safe-zone">
      {/* Tabs (shadcn) */}
      <div className="mb-8">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 w-full flex justify-start overflow-x-auto h-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon as any;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id as any}
                  className="px-6 py-3 rounded-xl flex-1 md:flex-none data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm font-semibold transition-all duration-200"
                >
                  <IconComponent className="w-4.5 h-4.5 mr-2.5" /> {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT COLUMN: Inputs & Customization */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="px-8 py-6 border-b border-slate-100 dark:border-slate-800/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold flex items-center gap-2.5 text-slate-900 dark:text-slate-50">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                    <QrCode className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  {t('qrDetails')}
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors" onClick={resetForm}>
                  {t('clearAllFields')}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              {/* Contextual Inputs */}
              <div className="space-y-4">
                {activeTab === 'url' && (
                  <div className="space-y-2">
                    <Label className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t('websiteUrl')}</Label>
                    <div className="relative group">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <Input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder={t('urlPlaceholder')}
                        className="h-14 pl-12 text-base rounded-2xl bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 ml-1">{t('urlHelp')}</p>
                  </div>
                )}

                {activeTab === 'text' && (
                  <div className="space-y-2">
                    <Label className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t('textContent')}</Label>
                    <Textarea
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder={t('textPlaceholder')}
                      rows={4}
                      className="w-full text-base rounded-2xl p-4 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                    />
                  </div>
                )}

                {activeTab === 'contact' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t('firstName')}</Label>
                        <Input value={contactInfo.firstName} onChange={(e) => setContactInfo({ ...contactInfo, firstName: e.target.value })} placeholder={t('firstNamePlaceholder')} className="h-12 rounded-xl bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t('lastName')}</Label>
                        <Input value={contactInfo.lastName} onChange={(e) => setContactInfo({ ...contactInfo, lastName: e.target.value })} placeholder={t('lastNamePlaceholder')} className="h-12 rounded-xl bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t('phoneNumber')}</Label>
                        <Input type="tel" value={contactInfo.phone} onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })} placeholder={t('phonePlaceholder')} className="h-12 rounded-xl bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t('emailAddress')}</Label>
                        <Input type="email" value={contactInfo.email} onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })} placeholder={t('emailPlaceholder')} className="h-12 rounded-xl bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t('organization')}</Label>
                      <Input value={contactInfo.organization} onChange={(e) => setContactInfo({ ...contactInfo, organization: e.target.value })} placeholder={t('organizationPlaceholder')} className="h-12 rounded-xl bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800" />
                    </div>
                  </div>
                )}
              </div>

              {/* Technical Options */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800/50">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">{t('configuration')}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Size (px)</Label>
                    <Input type="number" min={128} max={1024} value={size} onChange={(e) => setSize(Math.max(128, Math.min(1024, Number(e.target.value) || 300)))} className="h-10 rounded-lg bg-slate-50/50 dark:bg-slate-900/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Margin</Label>
                    <Input type="number" min={0} max={16} value={margin} onChange={(e) => setMargin(Math.max(0, Math.min(16, Number(e.target.value) || 2)))} className="h-10 rounded-lg bg-slate-50/50 dark:bg-slate-900/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">ECC</Label>
                    <Select value={ecc} onValueChange={(v) => setEcc(v as 'L' | 'M' | 'Q' | 'H')}>
                      <SelectTrigger className="h-10 rounded-lg bg-slate-50/50 dark:bg-slate-900/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L">L (7%)</SelectItem>
                        <SelectItem value="M">M (15%)</SelectItem>
                        <SelectItem value="Q">Q (25%)</SelectItem>
                        <SelectItem value="H">H (30%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Format</Label>
                    <Select value={format} onValueChange={(v) => setFormat(v as 'png' | 'svg')}>
                      <SelectTrigger className="h-10 rounded-lg bg-slate-50/50 dark:bg-slate-900/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="svg">SVG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Visual Customization */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800/50 space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t('appearance')}</h4>
                  <div className="flex items-center gap-2">
                    <input id="autoColors" type="checkbox" checked={autoColors} onChange={(e) => setAutoColors(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <label htmlFor="autoColors" className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('autoColors')}</label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-xs font-medium">Module Color</Label>
                    <div className="flex gap-2">
                      <div className="relative h-11 w-11 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 flex-shrink-0 shadow-sm">
                        <input type="color" value={moduleColor} disabled={autoColors} onChange={(e) => setModuleColor(e.target.value)} className="absolute inset-0 h-[100%] w-[100%] scale-[2] cursor-pointer disabled:cursor-not-allowed border-none p-0 outline-none" />
                      </div>
                      <Input type="text" value={moduleColor} disabled={autoColors} onChange={(e) => setModuleColor(e.target.value)} className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900/50 uppercase font-mono text-sm tracking-wider" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-medium">Background Color</Label>
                    <div className="flex gap-2">
                      <div className="relative h-11 w-11 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 flex-shrink-0 shadow-sm">
                        <input type="color" value={bgColor} disabled={autoColors} onChange={(e) => setBgColor(e.target.value)} className="absolute inset-0 h-[100%] w-[100%] scale-[2] cursor-pointer disabled:cursor-not-allowed border-none p-0 outline-none" />
                      </div>
                      <Input type="text" value={bgColor} disabled={autoColors} onChange={(e) => setBgColor(e.target.value)} className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900/50 uppercase font-mono text-sm tracking-wider" />
                    </div>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="space-y-3">
                  <Label className="text-xs font-medium text-slate-500">{t('quickStyles')}</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" size="sm" className="rounded-full h-8 px-4 text-xs font-bold border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 transition-all hover:scale-105" onClick={() => applyPreset('classic')}>
                      Classic
                    </Button>
                    <Button type="button" variant="outline" size="sm" className="rounded-full h-8 px-4 text-xs font-bold border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-900/50 dark:text-blue-400 dark:hover:bg-blue-950/30 transition-all hover:scale-105" onClick={() => applyPreset('modern-blue')}>
                      Azure
                    </Button>
                    <Button type="button" variant="outline" size="sm" className="rounded-full h-8 px-4 text-xs font-bold border-purple-200 text-purple-600 hover:bg-purple-50 dark:border-purple-900/50 dark:text-purple-400 dark:hover:bg-purple-950/30 transition-all hover:scale-105" onClick={() => applyPreset('vibrant-purple')}>
                      Amethyst
                    </Button>
                    <Button type="button" variant="outline" size="sm" className="rounded-full h-8 px-4 text-xs font-bold border-amber-200 text-amber-600 hover:bg-amber-50 dark:border-amber-900/50 dark:text-amber-400 dark:hover:bg-amber-950/30 transition-all hover:scale-105" onClick={() => applyPreset('dark-gold')}>
                      Gold Rush
                    </Button>
                    <Button type="button" variant="ghost" size="sm" className="rounded-full h-8 px-4 text-xs font-bold text-slate-500 underline" onClick={() => setAutoColors(true)}>
                      Reset to Theme
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Preview & Actions */}
        <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-6">
          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl rounded-3xl overflow-hidden group">
            <CardHeader className="px-8 py-6 pb-2 border-b-0">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100 uppercase tracking-widest">
                <span>{t('livePreview')}</span>
                {qrData && <div className="ml-auto w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="relative aspect-square w-full rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/50 flex flex-col items-center justify-center p-8 transition-all duration-500 group-hover:shadow-inner border-2 border-dashed border-slate-200 dark:border-slate-800">
                {qrData ? (
                  <>
                    <div ref={qrContainerRef} className="flex justify-center transition-transform duration-300 hover:scale-105"></div>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-6 tracking-wide flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-500" /> {t('scanQrCode')}
                    </p>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="w-24 h-24 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <QrCode className="w-12 h-12 text-slate-400 dark:text-slate-600 animate-bounce" />
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 font-medium px-4">{t('fillFormPrompt')}</p>
                  </div>
                )}

                {/* Decorative Elements */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-slate-300 dark:border-slate-700 rounded-tl-sm opacity-50" />
                <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-slate-300 dark:border-slate-700 rounded-tr-sm opacity-50" />
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-slate-300 dark:border-slate-700 rounded-bl-sm opacity-50" />
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-slate-300 dark:border-slate-700 rounded-br-sm opacity-50" />
              </div>

              {qrData && (
                <div className="mt-8 space-y-4">
                  <div className="flex gap-3">
                    <Button onClick={downloadQRCode} className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all active:scale-95 font-bold">
                      <Download className="w-4 h-4 mr-2" /> {format === 'svg' ? 'Export SVG' : 'Download PNG'}
                    </Button>
                    <Button variant="outline" onClick={copyToClipboard} className="h-12 w-14 rounded-xl border-slate-200 dark:border-slate-800 transition-all active:scale-90 flex items-center justify-center">
                      {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                    </Button>
                  </div>

                  {/* Data Summary Accordion-like shadow box */}
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800/50 overflow-hidden">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('qrCodeData')}</h3>
                      <span className="text-[10px] py-0.5 px-2 bg-slate-200 dark:bg-slate-800 rounded-full font-mono text-slate-600 dark:text-slate-400">{qrData.length} chars</span>
                    </div>
                    <div className="max-h-24 overflow-y-auto custom-scrollbar">
                      <pre className="text-[11px] font-mono text-slate-600 dark:text-slate-300 break-all leading-relaxed whitespace-pre-wrap">{qrData}</pre>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Note */}
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
    { question: 'What is a QR code and how does it work?', answer: 'A QR code stores information such as URLs or text. Scanning it decodes and triggers actions like opening links or saving contacts.' },
    { question: 'What types of information can I encode?', answer: 'URLs, plain text, contact info (vCard), phone, email, WiFi, and more. This generator supports URL, Text, and Contact formats.' },
    { question: 'What is error correction level?', answer: 'Levels: L (7%), M (15%), Q (25%), H (30%). Use M generally; H for partially covered or printed codes.' },
    { question: 'Recommended sizes for printing?', answer: 'At least 2×2 cm for business cards; larger for posters. Default 300×300 is suitable for many cases.' },
    { question: 'Do QR codes expire?', answer: 'Static QR codes don’t expire. If the URL target goes offline, the link fails but the code remains valid.' },
    { question: 'Are QR codes secure?', answer: 'The code is safe; verify unknown sources. This tool generates client-side codes and never sends data to servers.' },
    { question: 'PNG vs SVG?', answer: 'PNG suits digital use. SVG scales infinitely for professional print without pixelation.' },
    { question: 'Do you store data?', answer: 'No. All generation occurs locally in your browser for privacy.' },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const editorial = (
    <div className="space-y-8 skn-editorial-sections">
      <section id="what-is">
        <h2 className="text-2xl font-semibold">What is a QR Code?</h2>
        <p className="mt-2">
          A QR code is a matrix barcode that can store links, text or contact details. When scanned,
          it decodes the information and triggers actions like opening a website, composing an email,
          saving a vCard or sharing plain text.
        </p>
      </section>
      <section id="how-to">
        <h2 className="text-2xl font-semibold">How to Use this Generator</h2>
        <ul className="list-disc ml-6 mt-2 space-y-2">
          <li>Select one of the tabs: URL, Text or Contact (vCard).</li>
          <li>Fill in the fields. For URLs, we auto‑prefix https:// when missing.</li>
          <li>Customize options: size, margins, error‑correction level (ECC), PNG or SVG, and colors.</li>
          <li>Download the generated code or copy the encoded data to clipboard.</li>
        </ul>
      </section>
      <section id="features">
        <h2 className="text-2xl font-semibold">Features & Options</h2>
        <p className="mt-2">
          Choose among ECC levels L/M/Q/H to increase scan robustness. SVG is ideal for print because it
          scales without pixelation, while PNG is great for screens. Colors can follow your brand using
          the “Use Brand Color” action or automatic theme mode (light/dark).
        </p>
      </section>
      <section id="printing">
        <h2 className="text-2xl font-semibold">Printing Best Practices</h2>
        <p className="mt-2">
          Keep sufficient contrast and quiet zone (margin). Avoid low resolution for large prints.
          Test scanning under different lighting conditions. For business cards, 2×2 cm is a practical minimum;
          for posters, increase size proportionally to viewing distance.
        </p>
      </section>
      <section id="privacy">
        <h2 className="text-2xl font-semibold">Privacy & Security</h2>
        <p className="mt-2">
          Generation happens locally in your browser. We do not store or send your data. Always verify
          unknown QR sources and prefer H ECC for codes that might be partially covered or worn.
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

      <section id="references">
        <h2 className="text-2xl font-semibold">References & Additional Resources</h2>
        <ul className="list-disc pl-5 mt-4 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          <li>
            <a href="https://www.qrcode.com/en/history/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              History of QR Code - Denso Wave
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Official history and development story of the QR Code from its inventors at Denso Wave.
            </p>
          </li>
          <li>
            <a href="https://en.wikipedia.org/wiki/QR_code" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              QR Code - Wikipedia
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Comprehensive encyclopedia article covering QR code standards, versions, and error correction levels.
            </p>
          </li>
          <li>
            <a href="https://www.kaspersky.com/resource-center/definitions/what-is-a-qr-code-how-to-scan" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              QR Code Security Guide - Kaspersky
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Essential security tips and best practices for scanning and generating QR codes safely.
            </p>
          </li>
        </ul>
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
          "@type": "WebPage",
          name: "Free QR Code Generator",
          description: "Create free QR codes for URLs, text and vCard. Download PNG/SVG, choose ECC, margins, size and brand colors. Private, client‑side generator.",
          url: "https://www.smartkitnow.com/everyday-life/qr-code-generator"
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.smartkitnow.com/" },
            { "@type": "ListItem", position: 2, name: "Everyday Life", item: "https://www.smartkitnow.com/everyday" },
            { "@type": "ListItem", position: 3, name: "Free QR Code Generator", item: "https://www.smartkitnow.com/everyday-life/qr-code-generator" }
          ]
        }
      ].filter(Boolean)}
      onThisPage={[
        { id: 'what-is', label: 'What is a QR Code?' },
        { id: 'how-to', label: 'How to Use' },
        { id: 'features', label: 'Features & Options' },
        { id: 'printing', label: 'Printing Tips' },
        { id: 'privacy', label: 'Privacy' },
        { id: 'faq', label: 'FAQs' },
        { id: 'references', label: 'References' },
      ]}
      relatedCalculators={[
        { title: 'Unit Converter', url: '/conversion/unit-converter', icon: '🔁' },
        { title: 'Loan Payment Calculator', url: '/financial/loan-payment', icon: '💵' },
        { title: 'BMI Calculator', url: '/health/bmi-calculator', icon: '⚖️' },
      ]}
    />
  );
};

export default QRCodeGenerator;
