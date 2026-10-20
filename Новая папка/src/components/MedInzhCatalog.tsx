import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  ShieldCheck,
  Activity,
  Layers,
  ChevronRight,
  X,
  FileText,
  SlidersHorizontal,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export interface ProductVariant {
  sku: string;
  nominalSizeMm: number;
  outerDiameterMm: number;
  eoaCm2?: number;
  deliveryProfileFr?: number;
  isAvailable: boolean;
}

export interface ProductItem {
  id: string;
  slug: string;
  categorySlug: 'valves' | 'stent_grafts' | 'coronary_stents' | 'sutures';
  categoryName: string;
  modelName: string;
  tradeName: string;
  rznCertificate: string;
  ktruCode: string;
  materials: { name: string; component: string }[];
  description: string;
  clinicalAdvantage: string;
  variants: ProductVariant[];
  files: { title: string; type: 'rzn' | 'ifu' | 'tz'; size: string }[];
}

const CATALOG_DATA: ProductItem[] = [
  {
    id: 'prod-01',
    slug: 'medinzh-2-aortic',
    categorySlug: 'valves',
    categoryName: 'Клапаны сердца',
    modelName: '«МедИнж-2» Аортальный',
    tradeName: 'Протез клапана сердца механический двустворчатый поворотный «МедИнж-2»',
    rznCertificate: 'РЗН 2016/4120',
    ktruCode: '32.50.22.110-00000014',
    materials: [
      { name: 'Изотропный пироуглерод', component: 'Створки и корпус' },
      { name: 'Полиэфирное полотно', component: 'Шовная манжета' },
      { name: 'Титан ВТ6', component: 'Опорное кольцо' }
    ],
    description: 'Флагманский двустворчатый механический протез с центральным физиологическим током крови и сниженным гидродинамическим сопротивлением.',
    clinicalAdvantage: 'Уникальная геометрия осевых шарниров обеспечивает постоянное промывание углублений, минимизируя риск тромбообразования даже при невысоких дозах антикоагулянтов.',
    variants: [
      { sku: 'MI-2-19-A', nominalSizeMm: 19, outerDiameterMm: 24.5, eoaCm2: 1.45, isAvailable: true },
      { sku: 'MI-2-21-A', nominalSizeMm: 21, outerDiameterMm: 26.5, eoaCm2: 1.72, isAvailable: true },
      { sku: 'MI-2-23-A', nominalSizeMm: 23, outerDiameterMm: 28.5, eoaCm2: 2.05, isAvailable: true },
      { sku: 'MI-2-25-A', nominalSizeMm: 25, outerDiameterMm: 30.5, eoaCm2: 2.38, isAvailable: true },
      { sku: 'MI-2-27-A', nominalSizeMm: 27, outerDiameterMm: 32.5, eoaCm2: 2.70, isAvailable: true }
    ],
    files: [
      { title: 'Регистрационное удостоверение (скан РУ).pdf', type: 'rzn', size: '2.4 МБ' },
      { title: 'Инструкция по клиническому применению (IFU).pdf', type: 'ifu', size: '1.8 МБ' },
      { title: 'Техническое задание для госзакупок (44-ФЗ).docx', type: 'tz', size: '420 КБ' }
    ]
  },
  {
    id: 'prod-02',
    slug: 'medinzh-2-mitral',
    categorySlug: 'valves',
    categoryName: 'Клапаны сердца',
    modelName: '«МедИнж-2» Митральный',
    tradeName: 'Протез клапана сердца механический двустворчатый «МедИнж-2» митральный с низким профилем',
    rznCertificate: 'РЗН 2016/4120',
    ktruCode: '32.50.22.110-00000015',
    materials: [
      { name: 'Изотропный пироуглерод', component: 'Створки и корпус' },
      { name: 'Углеродный войлок', component: 'Манжета' }
    ],
    description: 'Низкопрофильная модификация для митральной позиции, предотвращающая обструкцию выводного тракта левого желудочка.',
    clinicalAdvantage: 'Угол раскрытия створок 85° обеспечивает свободный ламинарный приток крови без завихрений у стенок желудочка.',
    variants: [
      { sku: 'MI-2-25-M', nominalSizeMm: 25, outerDiameterMm: 31.0, eoaCm2: 2.45, isAvailable: true },
      { sku: 'MI-2-27-M', nominalSizeMm: 27, outerDiameterMm: 33.0, eoaCm2: 2.85, isAvailable: true },
      { sku: 'MI-2-29-M', nominalSizeMm: 29, outerDiameterMm: 35.0, eoaCm2: 3.20, isAvailable: true },
      { sku: 'MI-2-31-M', nominalSizeMm: 31, outerDiameterMm: 37.0, eoaCm2: 3.55, isAvailable: true }
    ],
    files: [
      { title: 'Регистрационное удостоверение (скан РУ).pdf', type: 'rzn', size: '2.4 МБ' },
      { title: 'Инструкция по применению (IFU).pdf', type: 'ifu', size: '1.9 МБ' }
    ]
  },
  {
    id: 'prod-03',
    slug: 'stent-graft-thoracic',
    categorySlug: 'stent_grafts',
    categoryName: 'Стент-графты',
    modelName: 'Стент-графт аортальный торакальный',
    tradeName: 'Эндопротез сосудистый аортальный самораскрывающийся с системой доставки',
    rznCertificate: 'РЗН 2021/15430',
    ktruCode: '32.50.22.110-00000088',
    materials: [
      { name: 'Нитинол (сплав с памятью формы)', component: 'Самораскрывающийся каркас' },
      { name: 'Тканый полиэфир высокой плотности', component: 'Герметичное покрытие' },
      { name: 'Платина/Иридий', component: 'Рентгеноконтрастные метки' }
    ],
    description: 'Предназначен для эндоваскулярного исключения аневризм и расслоений грудного отдела нисходящей аорты.',
    clinicalAdvantage: 'Прецизионная радиальная сила фиксации исключает миграцию, сохраняя эластичность и податливость естественному изгибу дуги аорты.',
    variants: [
      { sku: 'SG-T-26-120', nominalSizeMm: 26, outerDiameterMm: 26.0, deliveryProfileFr: 18, isAvailable: true },
      { sku: 'SG-T-28-140', nominalSizeMm: 28, outerDiameterMm: 28.0, deliveryProfileFr: 18, isAvailable: true },
      { sku: 'SG-T-32-160', nominalSizeMm: 32, outerDiameterMm: 32.0, deliveryProfileFr: 20, isAvailable: true },
      { sku: 'SG-T-34-180', nominalSizeMm: 34, outerDiameterMm: 34.0, deliveryProfileFr: 22, isAvailable: false }
    ],
    files: [
      { title: 'РУ на медицинское изделие.pdf', type: 'rzn', size: '3.1 МБ' },
      { title: 'Руководство интервенционного хирурга.pdf', type: 'ifu', size: '4.5 МБ' },
      { title: 'Техническая спецификация для аукциона.docx', type: 'tz', size: '510 КБ' }
    ]
  },
  {
    id: 'prod-04',
    slug: 'coronary-stent-des',
    categorySlug: 'coronary_stents',
    categoryName: 'Коронарные стенты',
    modelName: 'Коронарный стент с биодеградируемым покрытием',
    tradeName: 'Стент коронарный кобальт-хромовый с антипролиферативным лекарственным покрытием',
    rznCertificate: 'РЗН 2019/8821',
    ktruCode: '32.50.22.110-00000104',
    materials: [
      { name: 'Кобальт-хромовый сплав L605', component: 'Баллонорасширяемый каркас' },
      { name: 'Биорезорбируемый полимер (PLLA/PLGA)', component: 'Лекарственная матрица' },
      { name: 'Сиролимус (Sirolimus)', component: 'Антипролиферативный агент' }
    ],
    description: 'Ультратонкая страта (65 мкм) для лечения стенозирующих поражений венечных артерий сердца.',
    clinicalAdvantage: 'Полное рассасывание лекарственно-полимерного слоя за 6 месяцев с восстановлением эндотелиальной функции стенки сосуда.',
    variants: [
      { sku: 'ST-DES-25-18', nominalSizeMm: 2.5, outerDiameterMm: 2.5, deliveryProfileFr: 5, isAvailable: true },
      { sku: 'ST-DES-30-24', nominalSizeMm: 3.0, outerDiameterMm: 3.0, deliveryProfileFr: 5, isAvailable: true },
      { sku: 'ST-DES-35-28', nominalSizeMm: 3.5, outerDiameterMm: 3.5, deliveryProfileFr: 6, isAvailable: true }
    ],
    files: [
      { title: 'Скан РУ Росздравнадзора.pdf', type: 'rzn', size: '1.9 МБ' },
      { title: 'Инструкция по ангиопластике.pdf', type: 'ifu', size: '2.2 МБ' }
    ]
  }
];

export const MedInzhCatalog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [selectedSizeRange, setSelectedSizeRange] = useState<[number, number]>([19, 35]);
  const [filterOnlyAvailable, setFilterOnlyAvailable] = useState<boolean>(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [activeModalProduct, setActiveModalProduct] = useState<ProductItem | null>(null);

  const availableMaterials = useMemo(() => {
    const set = new Set<string>();
    CATALOG_DATA.forEach(p => p.materials.forEach(m => set.add(m.name)));
    return Array.from(set);
  }, []);

  const filteredProducts = useMemo(() => {
    return CATALOG_DATA.filter(item => {
      const matchesSearch =
        item.modelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.rznCertificate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ktruCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.variants.some(v => v.sku.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || item.categorySlug === selectedCategory;
      const matchesMaterial =
        selectedMaterial === 'all' || item.materials.some(m => m.name === selectedMaterial);
      const matchesAvailability = !filterOnlyAvailable || item.variants.some(v => v.isAvailable);
      const matchesSize = item.variants.some(
        v => v.nominalSizeMm >= selectedSizeRange[0] && v.nominalSizeMm <= selectedSizeRange[1]
      );

      return matchesSearch && matchesCategory && matchesMaterial && matchesAvailability && matchesSize;
    });
  }, [searchQuery, selectedCategory, selectedMaterial, selectedSizeRange, filterOnlyAvailable]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedMaterial('all');
    setSelectedSizeRange([19, 35]);
    setFilterOnlyAvailable(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-blue-700 text-xs font-semibold tracking-wider uppercase mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Реестр высокотехнологичных медизделий • ГОСТ ISO 13485</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Каталог продукции ЗАО НПП «МедИнж»
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Имплантируемые изделия для сердечно-сосудистой и эндоваскулярной хирургии с регистрационными удостоверениями Росздравнадзора.
            </p>
          </div>

          <div className="text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs max-w-xs">
            <span className="font-semibold text-slate-800 block mb-0.5">Для тендерных специалистов:</span>
            Все позиции содержат актуальные коды КТРУ и готовые ТЗ по 44-ФЗ / 223-ФЗ.
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className={`lg:col-span-3 ${isMobileFilterOpen ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden lg:block'}`}>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" /> Фильтры подбора
              </span>
              <button
                onClick={resetFilters}
                className="text-xs text-blue-600 hover:text-blue-800 transition-colors font-medium"
              >
                Сбросить
              </button>
              {isMobileFilterOpen && (
                <button onClick={() => setIsMobileFilterOpen(false)} className="lg:hidden p-1">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Категория изделия
              </label>
              <div className="space-y-1.5">
                {[
                  { slug: 'all', label: 'Все категории' },
                  { slug: 'valves', label: 'Клапаны сердца' },
                  { slug: 'stent_grafts', label: 'Стент-графты аорты' },
                  { slug: 'coronary_stents', label: 'Коронарные стенты' }
                ].map(cat => (
                  <button
                    key={cat.slug}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                      selectedCategory === cat.slug
                        ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {selectedCategory === cat.slug && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Материал изделия
              </label>
              <select
                value={selectedMaterial}
                onChange={e => setSelectedMaterial(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="all">Любой биоматериал</option>
                {availableMaterials.map((mat, i) => (
                  <option key={i} value={mat}>{mat}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Посадочный ø:
                </label>
                <span className="text-xs font-mono font-bold text-slate-800">
                  {selectedSizeRange[0]} – {selectedSizeRange[1]} мм
                </span>
              </div>
              <input
                type="range"
                min="19"
                max="35"
                step="1"
                value={selectedSizeRange[1]}
                onChange={e => setSelectedSizeRange([selectedSizeRange[0], Number(e.target.value)])}
                className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>19 мм</span>
                <span>27 мм</span>
                <span>35 мм</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterOnlyAvailable}
                  onChange={e => setFilterOnlyAvailable(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span className="text-xs font-medium text-slate-700">
                  Только типоразмеры на складе
                </span>
              </label>
            </div>

            {isMobileFilterOpen && (
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold mt-4"
              >
                Применить фильтры ({filteredProducts.length})
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-9 space-y-6">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Поиск по модели, артикулу SKU или РУ (например: МедИнж-2, 4120)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 flex items-center gap-1.5 text-xs font-medium"
            >
              <Filter className="w-4 h-4" />
              <span>Фильтры</span>
            </button>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
              <Activity className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-800">Изделия не найдены</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Попробуйте изменить параметры диапазона диаметров или сбросить фильтры материалов.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors"
              >
                Сбросить все фильтры
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                        {product.categoryName}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {product.rznCertificate}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5">
                      {product.modelName}
                    </h2>

                    <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                        <Layers className="w-3 h-3 text-slate-500" /> Конструкционные материалы:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {product.materials.map((m, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700 font-medium"
                          >
                            {m.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-5">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Посадочные диаметры в линейке:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {product.variants.map((v, i) => (
                          <span
                            key={i}
                            className={`text-xs px-2 py-0.5 rounded font-mono font-medium ${
                              v.isAvailable
                                ? 'bg-slate-100 text-slate-800'
                                : 'bg-slate-50 text-slate-400 line-through'
                            }`}
                          >
                            ø{v.nominalSizeMm}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setActiveModalProduct(product)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                    >
                      <span>Спецификация и чертежи</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setActiveModalProduct(product)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      Типоразмеры ({product.variants.length})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {activeModalProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setActiveModalProduct(null)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6 pr-8">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block mb-1">
                {activeModalProduct.categoryName} • Регистрация {activeModalProduct.rznCertificate}
              </span>
              <h2 className="text-2xl font-bold text-slate-900">
                {activeModalProduct.modelName}
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                Код позиции КТРУ: {activeModalProduct.ktruCode}
              </p>
            </div>

            <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-xl mb-6">
              <span className="text-xs font-bold text-blue-900 block mb-1 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-blue-700" /> Клинические преимущества гемодинамики:
              </span>
              <p className="text-xs sm:text-sm text-blue-950 leading-relaxed">
                {activeModalProduct.clinicalAdvantage}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Размерный ряд и гидродинамические характеристики
              </h3>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Артикул (SKU)</th>
                      <th className="py-2.5 px-3">Посадочный ø (мм)</th>
                      <th className="py-2.5 px-3">Внешний ø (мм)</th>
                      {activeModalProduct.variants.some(v => v.eoaCm2) && (
                        <th className="py-2.5 px-3">Площадь EOA (см²)</th>
                      )}
                      {activeModalProduct.variants.some(v => v.deliveryProfileFr) && (
                        <th className="py-2.5 px-3">Профиль (Fr)</th>
                      )}
                      <th className="py-2.5 px-3 text-right">Наличие</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeModalProduct.variants.map((v, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2 px-3 font-mono font-medium text-slate-900">{v.sku}</td>
                        <td className="py-2 px-3 font-mono">{v.nominalSizeMm}</td>
                        <td className="py-2 px-3 font-mono">{v.outerDiameterMm}</td>
                        {activeModalProduct.variants.some(x => x.eoaCm2) && (
                          <td className="py-2 px-3 font-mono text-blue-700 font-semibold">{v.eoaCm2 || '—'}</td>
                        )}
                        {activeModalProduct.variants.some(x => x.deliveryProfileFr) && (
                          <td className="py-2 px-3 font-mono">{v.deliveryProfileFr || '—'}</td>
                        )}
                        <td className="py-2 px-3 text-right">
                          {v.isAvailable ? (
                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              В наличии
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                              Под заказ
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-500" /> Официальная документация для ЛПУ и тендеров:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeModalProduct.files.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs hover:border-blue-400 transition-colors"
                  >
                    <div className="truncate mr-2">
                      <span className="font-medium text-slate-800 block truncate">{file.title}</span>
                      <span className="text-[10px] text-slate-400">{file.size}</span>
                    </div>
                    <button
                      onClick={() => alert(`Загрузка: ${file.title}`)}
                      className="p-1.5 bg-white text-slate-700 hover:text-blue-600 rounded-lg border border-slate-200 transition-all flex-shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setActiveModalProduct(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Закрыть
              </button>
              <button
                onClick={() => alert(`Формирование спецификации для ${activeModalProduct.modelName}`)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <span>Запросить коммерческое предложение</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
