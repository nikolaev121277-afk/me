import React, { useState } from 'react';
import {
  HeartPulse,
  ShieldCheck,
  FileText,
  User,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Menu,
  X,
  Boxes,
  Activity,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

import { MedInzhCatalog } from './components/MedInzhCatalog';
import { HeartValve3DViewer } from './components/HeartValve3DViewer';
import { StentGraft3DViewer } from './components/StentGraft3DViewer';
import { DoctorComplaintsDashboard } from './components/DoctorComplaintsDashboard';
import { ComplaintSubmissionForm } from './components/ComplaintSubmissionForm';

type PageRoute = 'home' | 'catalog' | '3d-models' | 'doctor-portal';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [active3DTab, setActive3DTab] = useState<'valve' | 'stent-graft'>('valve');
  const [cookieConsentDismissed, setCookieConsentDismissed] = useState(false);

  const navigateTo = (route: PageRoute) => {
    setCurrentPage(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>ГОСТ ISO 13485 • ГОСТ Р ИСО 9001 • Лицензия Росздравнадзора</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a href="tel:+78412590000" className="hover:text-white transition-colors flex items-center gap-1">
              <Phone className="w-3 h-3 text-slate-400" />
              <span>+7 (8412) 59-00-00 (Отдел сбыта)</span>
            </a>
            <span className="hidden sm:inline text-slate-600">|</span>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-white">RU</span>
              <span className="text-slate-500 hover:text-slate-300 cursor-pointer">EN</span>
            </div>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div
            onClick={() => navigateTo('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  МЕДИНЖ
                </span>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded uppercase">
                  НПП
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">
                Биомедицинские изделия • Пенза
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => navigateTo('home')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentPage === 'home'
                  ? 'bg-slate-100 text-blue-600'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Главная
            </button>
            <button
              onClick={() => navigateTo('catalog')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentPage === 'catalog'
                  ? 'bg-slate-100 text-blue-600'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Каталог изделий
            </button>
            <button
              onClick={() => navigateTo('3d-models')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                currentPage === '3d-models'
                  ? 'bg-slate-100 text-blue-600'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Boxes className="w-4 h-4 text-blue-500" />
              <span>3D-Лаборатория</span>
            </button>
            <button
              onClick={() => navigateTo('doctor-portal')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                currentPage === 'doctor-portal'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <User className="w-4 h-4 text-blue-600" />
              <span>Портал врача (СМК)</span>
            </button>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => setIsComplaintModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold transition-all flex items-center gap-2 shadow-2xs"
            >
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Извещение об инциденте</span>
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
            <button
              onClick={() => navigateTo('home')}
              className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Главная
            </button>
            <button
              onClick={() => navigateTo('catalog')}
              className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Каталог изделий
            </button>
            <button
              onClick={() => navigateTo('3d-models')}
              className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50 flex items-center justify-between"
            >
              <span>3D-Лаборатория изделий</span>
              <Boxes className="w-4 h-4 text-blue-600" />
            </button>
            <button
              onClick={() => navigateTo('doctor-portal')}
              className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-blue-700 bg-blue-50/60"
            >
              Портал врача и мониторинг СМК
            </button>
            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsComplaintModalOpen(true);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-red-600 text-white text-xs font-bold text-center flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Подать извещение об инциденте</span>
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {currentPage === 'home' && (
          <div className="space-y-16 sm:space-y-24 pb-16">
            <section className="relative bg-slate-950 text-white overflow-hidden py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-medium tracking-wide">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                    Высокотехнологичные медицинские изделия • С 1994 года
                  </div>

                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                    Передовые технологии кардиохирургии и радиологии
                  </h1>

                  <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
                    Разработка и полный цикл серийного производства искусственных клапанов сердца, эндоваскулярных стент-графтов аорты, коронарных стентов и шовных материалов.
                  </p>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <button
                      onClick={() => navigateTo('catalog')}
                      className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
                    >
                      <span>Открыть каталог изделий</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => navigateTo('3d-models')}
                      className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-sm transition-colors flex items-center gap-2"
                    >
                      <Boxes className="w-4 h-4 text-cyan-400" />
                      <span>Интерактивные 3D-модели</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-800">
                    <div>
                      <div className="text-2xl sm:text-3xl font-black text-white">&gt;150 000</div>
                      <div className="text-xs text-slate-400 mt-0.5">Успешных имплантаций</div>
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-black text-white">ISO 13485</div>
                      <div className="text-xs text-slate-400 mt-0.5">Сертификация СМК</div>
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-black text-white">30+ лет</div>
                      <div className="text-xs text-slate-400 mt-0.5">Собственной школы R&D</div>
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-black text-cyan-400">Топ-1</div>
                      <div className="text-xs text-slate-400 mt-0.5">По клапанам в РФ</div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-slate-900/80 rounded-3xl p-5 border border-slate-800 shadow-2xl relative">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                    <span className="text-xs font-mono font-bold text-blue-400 uppercase">
                      Инженерный модуль • Клапан «МедИнж-2»
                    </span>
                    <button
                      onClick={() => navigateTo('3d-models')}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <span>Развернуть</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-slate-800/80">
                    <HeartValve3DViewer />
                  </div>
                </div>
              </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                  onClick={() => navigateTo('doctor-portal')}
                  className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <HeartPulse className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Хирургам и специалистам</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
                    Каталоги типоразмеров, паспорта изделий, протоколы имплантации (IFU) и онлайн-мониторинг безопасности СМК.
                  </p>
                  <span className="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                    <span>Войти в портал специалиста</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div
                  onClick={() => navigateTo('catalog')}
                  className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Закупкам и дистрибьюторам</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
                    Реестр Регистрационных удостоверений (РУ), коды КТРУ и ОКПД2, готовые технические задания по 44-ФЗ и 223-ФЗ.
                  </p>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                    <span>Перейти к позициям КТРУ</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div
                  onClick={() => navigateTo('3d-models')}
                  className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Boxes className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">3D-Лаборатория R&D</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
                    Интерактивное исследование физики раскрытия нитинола и кинематики пироуглеродных створок в реальном масштабе.
                  </p>
                  <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                    <span>Исследовать кинематику</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </section>
          </div>
        )}

        {currentPage === 'catalog' && (
          <div>
            <MedInzhCatalog />
          </div>
        )}

        {currentPage === '3d-models' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Интерактивная визуализация биомеханики
              </span>
              <h1 className="text-3xl font-black text-slate-900">
                Цифровые 3D-двойники медицинских изделий
              </h1>
              <p className="text-sm text-slate-600">
                Изучите поведение конструкционных биоматериалов при симуляции сердечного цикла и эндоваскулярного раскрытия.
              </p>
            </div>

            <div className="flex justify-center">
              <div className="bg-slate-200/80 p-1.5 rounded-2xl flex gap-1">
                <button
                  onClick={() => setActive3DTab('valve')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    active3DTab === 'valve'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <HeartPulse className="w-4 h-4 text-blue-600" />
                  <span>Клапан «МедИнж-2»</span>
                </button>
                <button
                  onClick={() => setActive3DTab('stent-graft')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    active3DTab === 'stent-graft'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Activity className="w-4 h-4 text-cyan-600" />
                  <span>Стент-графт аорты</span>
                </button>
              </div>
            </div>

            <div>
              {active3DTab === 'valve' ? <HeartValve3DViewer /> : <StentGraft3DViewer />}
            </div>
          </div>
        )}

        {currentPage === 'doctor-portal' && (
          <div>
            <DoctorComplaintsDashboard />
          </div>
        )}
      </main>

      {isComplaintModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-white rounded-3xl max-w-4xl w-full my-8 shadow-2xl border border-slate-200 overflow-hidden">
            <button
              onClick={() => setIsComplaintModalOpen(false)}
              className="absolute top-5 right-5 z-10 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-2 sm:p-4">
              <ComplaintSubmissionForm />
            </div>
          </div>
        </div>
      )}

      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
        <div className="bg-slate-950 py-4 px-4 sm:px-6 lg:px-8 border-b border-slate-800/60">
          <div className="max-w-7xl mx-auto flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-200">Информация для специалистов здравоохранения:</span> Данный интернет-ресурс содержит информацию о медицинских изделиях, предназначенных исключительно для сертифицированных врачей и специалистов лечебно-профилактических учреждений. Имеются противопоказания. Перед применением необходимо ознакомиться с утвержденной Инструкцией по эксплуатации (ИЭ/IFU).
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <HeartPulse className="w-5 h-5 text-blue-500" />
              <span>ЗАО НПП «МедИнж»</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Ведущее российское научно-производственное предприятие по разработке и серийному выпуску имплантируемых сердечно-сосудистых протезов.
            </p>
            <p className="text-[10px] text-slate-500">
              © 1994–2026 ЗАО НПП «МедИнж». Все права защищены.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Продукция</h4>
            <ul className="space-y-2 text-[11px]">
              <li><button onClick={() => navigateTo('catalog')} className="hover:text-white transition-colors">Механические клапаны «МедИнж-2»</button></li>
              <li><button onClick={() => navigateTo('catalog')} className="hover:text-white transition-colors">Биологические протезы сердца</button></li>
              <li><button onClick={() => navigateTo('catalog')} className="hover:text-white transition-colors">Стент-графты грудной аорты</button></li>
              <li><button onClick={() => navigateTo('catalog')} className="hover:text-white transition-colors">Коронарные стенты с покрытием</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Служба качества и СМК</h4>
            <ul className="space-y-2 text-[11px]">
              <li><button onClick={() => navigateTo('doctor-portal')} className="hover:text-white transition-colors">Мониторинг безопасности медизделий</button></li>
              <li><button onClick={() => setIsComplaintModalOpen(true)} className="hover:text-red-400 transition-colors">Подать рекламацию (Приказ № 961н)</button></li>
              <li><a href="#" className="hover:text-white transition-colors">Политика качества ISO 13485</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Политика 152-ФЗ о защите данных</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Контакты производства</h4>
            <div className="space-y-2 text-[11px]">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span>440004, Россия, г. Пенза, ул. Центральная, д. 1</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span>+7 (8412) 59-00-00</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span>inbox@medinzh.ru</span>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {!cookieConsentDismissed && (
        <div className="fixed bottom-4 right-4 max-w-md bg-white border border-slate-300 p-4 rounded-2xl shadow-xl z-50 text-xs text-slate-700 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="leading-snug">
              Мы используем файлы cookie и технические данные для обеспечения корректной работы каталога в соответствии с Федеральным законом № 152-ФЗ.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCookieConsentDismissed(true)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-colors"
              >
                Принять
              </button>
              <button
                onClick={() => setCookieConsentDismissed(true)}
                className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg transition-colors"
              >
                Подробнее
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
