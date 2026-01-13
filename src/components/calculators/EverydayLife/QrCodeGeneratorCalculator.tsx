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
  },
};

// Always English
const t = (key: keyof typeof TRANSLATIONS['en-US']) => TRANSLATIONS['en-US'][key] || String(key);

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

  const applyPreset = (preset: 'high' | 'brand-light' | 'brand-dark') => {
    setAutoColors(false);
    const brand = getComputedStyle(document.documentElement).getPropertyValue('--skn-brand').trim() || '#2563eb';
    if (preset === 'high') {
      setModuleColor('#000000');
      setBgColor('#ffffff');
    } else if (preset === 'brand-light') {
      setModuleColor(brand);
      setBgColor('#ffffff');
    } else {
      setModuleColor(brand);
      setBgColor('#0f172a');
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
      <div className="mb-6">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 w-full flex justify-start overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon as any;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id as any}
                  className="px-4 py-2 rounded-lg flex-1 md:flex-none data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 font-medium"
                >
                  <IconComponent className="w-4 h-4 mr-2" /> {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Inputs + Preview */}
      <div className="space-y-8">
        {/* Inputs Card - Unified Dark Wrapper */}
        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#020617] shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="px-6 py-6 md:px-8 border-b-0 pb-2">
            <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-slate-50">
              <LinkIcon className="h-6 w-6 text-blue-600 dark:text-blue-500" />
              QR details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8 pt-2 space-y-6">
            {activeTab === 'url' && (
              <div>
                <Label className="mb-2 text-base font-semibold text-slate-900 dark:text-slate-50">{t('websiteUrl')}</Label>
                <Input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder={t('urlPlaceholder')}
                  className="h-12 text-base bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:ring-blue-500"
                />
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{t('urlHelp')}</p>
              </div>
            )}

            {activeTab === 'text' && (
              <div>
                <Label className="mb-2 text-base font-semibold">{t('textContent')}</Label>
                <Textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={t('textPlaceholder')}
                  rows={4}
                  className="w-full text-base bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800"
                />
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <Label className="mb-2 font-semibold">{t('firstName')}</Label>
                    <Input value={contactInfo.firstName} onChange={(e) => setContactInfo({ ...contactInfo, firstName: e.target.value })} placeholder={t('firstNamePlaceholder')} className="h-11 bg-slate-50 dark:bg-slate-900/50" />
                  </div>
                  <div>
                    <Label className="mb-2 font-semibold">{t('lastName')}</Label>
                    <Input value={contactInfo.lastName} onChange={(e) => setContactInfo({ ...contactInfo, lastName: e.target.value })} placeholder={t('lastNamePlaceholder')} className="h-11 bg-slate-50 dark:bg-slate-900/50" />
                  </div>
                </div>
                <div>
                  <Label className="mb-2 font-semibold">{t('phoneNumber')}</Label>
                  <Input type="tel" value={contactInfo.phone} onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })} placeholder={t('phonePlaceholder')} className="h-11 bg-slate-50 dark:bg-slate-900/50" />
                </div>
                <div>
                  <Label className="mb-2 font-semibold">{t('emailAddress')}</Label>
                  <Input type="email" value={contactInfo.email} onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })} placeholder={t('emailPlaceholder')} className="h-11 bg-slate-50 dark:bg-slate-900/50" />
                </div>
                <div>
                  <Label className="mb-2 font-semibold">{t('organization')}</Label>
                  <Input value={contactInfo.organization} onChange={(e) => setContactInfo({ ...contactInfo, organization: e.target.value })} placeholder={t('organizationPlaceholder')} className="h-11 bg-slate-50 dark:bg-slate-900/50" />
                </div>
                <div>
                  <Label className="mb-2 font-semibold">{t('website')}</Label>
                  <Input type="url" value={contactInfo.url} onChange={(e) => setContactInfo({ ...contactInfo, url: e.target.value })} placeholder={t('websitePlaceholder')} className="h-11 bg-slate-50 dark:bg-slate-900/50" />
                </div>
              </div>
            )}

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div>
                <Label className="mb-2 font-medium text-slate-700 dark:text-slate-300">Size (px)</Label>
                <Input type="number" min={128} max={1024} value={size} onChange={(e) => setSize(Math.max(128, Math.min(1024, Number(e.target.value) || 300)))} className="h-11 bg-slate-50 dark:bg-slate-900/50" />
              </div>
              <div>
                <Label className="mb-2 font-medium text-slate-700 dark:text-slate-300">Margin</Label>
                <Input type="number" min={0} max={16} value={margin} onChange={(e) => setMargin(Math.max(0, Math.min(16, Number(e.target.value) || 2)))} className="h-11 bg-slate-50 dark:bg-slate-900/50" />
              </div>
              <div>
                <Label className="mb-2 font-medium text-slate-700 dark:text-slate-300">Error correction</Label>
                <Select value={ecc} onValueChange={(v) => setEcc(v as 'L' | 'M' | 'Q' | 'H')}>
                  <SelectTrigger className="w-full h-11 bg-slate-50 dark:bg-slate-900/50" aria-label="ECC">
                    <SelectValue placeholder="Select ECC" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">L</SelectItem>
                    <SelectItem value="M">M</SelectItem>
                    <SelectItem value="Q">Q</SelectItem>
                    <SelectItem value="H">H</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-2 font-medium text-slate-700 dark:text-slate-300">Format</Label>
                <Select value={format} onValueChange={(v) => setFormat(v as 'png' | 'svg')}>
                  <SelectTrigger className="w-full h-11 bg-slate-50 dark:bg-slate-900/50" aria-label="Format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="svg">SVG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Color controls */}
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label className="mb-2 font-medium text-slate-700 dark:text-slate-300">Module color</Label>
                  <div className="flex gap-2">
                    <input type="color" value={moduleColor} disabled={autoColors} onChange={(e) => setModuleColor(e.target.value)} className="h-11 w-16 p-1 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 cursor-pointer" />
                    <Input type="text" value={moduleColor} disabled={autoColors} onChange={(e) => setModuleColor(e.target.value)} className="flex-1 h-11 bg-slate-50 dark:bg-slate-900/50 uppercase font-mono" />
                  </div>
                </div>
                <div>
                  <Label className="mb-2 font-medium text-slate-700 dark:text-slate-300">Background color</Label>
                  <div className="flex gap-2">
                    <input type="color" value={bgColor} disabled={autoColors} onChange={(e) => setBgColor(e.target.value)} className="h-11 w-16 p-1 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 cursor-pointer" />
                    <Input type="text" value={bgColor} disabled={autoColors} onChange={(e) => setBgColor(e.target.value)} className="flex-1 h-11 bg-slate-50 dark:bg-slate-900/50 uppercase font-mono" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <input id="autoColors" type="checkbox" checked={autoColors} onChange={(e) => setAutoColors(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <label htmlFor="autoColors" className="text-sm font-medium text-slate-700 dark:text-slate-200">Auto theme colors</label>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => {
                  const brand = getComputedStyle(document.documentElement).getPropertyValue('--skn-brand').trim();
                  if (brand) { setAutoColors(false); setModuleColor(brand); }
                }}>
                  Use Brand Color
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="ghost" className="w-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800" onClick={resetForm}>{t('clearAllFields')}</Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Card */}
        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
              Generated QR Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 w-full">
              {qrData ? (
                <div className="text-center">
                  <div ref={qrContainerRef} className="flex justify-center"></div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-4">{t('scanQrCode')}</p>
                </div>
              ) : (
                <div className="text-center py-16">
                  <QrCode className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-500 dark:text-slate-400">{t('fillFormPrompt')}</p>
                </div>
              )}
            </div>
            {qrData && (
              <div className="flex gap-4 w-full mt-4">
                <Button onClick={downloadQRCode} className="flex-1">
                  <Download className="w-4 h-4 mr-2" /> {format === 'svg' ? 'Download SVG' : t('download')}
                </Button>
                <Button variant="outline" onClick={copyToClipboard} className="flex-1">
                  {copied ? (<><Check className="w-4 h-4 mr-2 text-green-600" /> {t('copied')}</>) : (<><Copy className="w-4 h-4 mr-2" /> {t('copyData')}</>)}
                </Button>
              </div>
            )}
            {qrData && (
              <div className="w-full mt-4">
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">{t('qrCodeData')}</h3>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 text-xs text-slate-600 dark:text-slate-300 max-h-32 overflow-y-auto">
                  <pre className="whitespace-pre-wrap break-words">{qrData}</pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
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
