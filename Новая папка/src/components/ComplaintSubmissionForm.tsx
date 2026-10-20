import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Upload, 
  Trash2, 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  ShieldAlert,
  Building,
  HeartPulse
} from 'lucide-react';

export interface ComplaintFormData {
  organization: string;
  category: string;
  modelName: string;
  sku: string;
  lotNumber: string;
  serialNumber: string;
  eventDate: string;
  implantationDate: string;
  stage: string;
  severity: 'minor' | 'moderate' | 'critical' | 'fatal' | '';
  patientAnonCode: string;
  patientGender: 'male' | 'female' | '';
  patientAge: string;
  clinicalDiagnosis: string;
  incidentDescription: string;
  actionsTaken: string;
  deviceStatus: 'implanted' | 'explanted_retained' | 'returned_to_manufacturer' | 'disposed' | '';
  pickupRequired: boolean;
  files: File[];
  consentAnonymized: boolean;
  consentAccuracy: boolean;
}

const initialFormData: ComplaintFormData = {
  organization: 'ФГБУ «ФЦССХ» Минздрава России (г. Пенза)',
  category: 'valves',
  modelName: 'МедИнж-2 (аортальный поворотный)',
  sku: 'MI-2-21-A (21 мм)',
  lotNumber: '',
  serialNumber: '',
  eventDate: new Date().toISOString().split('T')[0],
  implantationDate: '',
  stage: 'intraoperative',
  severity: '',
  patientAnonCode: '',
  patientGender: '',
  patientAge: '',
  clinicalDiagnosis: '',
  incidentDescription: '',
  actionsTaken: '',
  deviceStatus: 'explanted_retained',
  pickupRequired: false,
  files: [],
  consentAnonymized: false,
  consentAccuracy: false,
};

export const ComplaintSubmissionForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<ComplaintFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedComplaintId, setSubmittedComplaintId] = useState<string | null>(null);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.organization.trim()) newErrors.organization = 'Укажите медицинское учреждение';
      if (!formData.lotNumber.trim()) newErrors.lotNumber = 'Обязательно укажите номер серии / партии (Lot)';
      if (!formData.eventDate) newErrors.eventDate = 'Укажите дату инцидента';
    }

    if (step === 2) {
      if (!formData.severity) newErrors.severity = 'Выберите степень тяжести инцидента';
      if (!formData.patientAnonCode.trim()) {
        newErrors.patientAnonCode = 'Укажите обезличенный номер карты или истории болезни';
      }
    }

    if (step === 3) {
      if (!formData.incidentDescription.trim() || formData.incidentDescription.length < 20) {
        newErrors.incidentDescription = 'Подробно опишите обстоятельства (не менее 20 символов)';
      }
      if (!formData.deviceStatus) newErrors.deviceStatus = 'Укажите текущее местонахождение изделия';
    }

    if (step === 4) {
      if (!formData.consentAnonymized) {
        newErrors.consentAnonymized = 'Требуется подтверждение обезличивания данных по 152-ФЗ';
      }
      if (!formData.consentAccuracy) {
        newErrors.consentAccuracy = 'Необходимо подтвердить достоверность предоставленных сведений';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, ...newFiles],
      }));
    }
  };

  const handleRemoveFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(4)) {
      const generatedId = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedComplaintId(generatedId);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-slate-50 rounded-2xl text-slate-800">
      <div className="mb-6">
        <div className="flex items-center space-x-3 text-red-700 mb-2">
          <HeartPulse className="w-7 h-7" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Служба качества ЗАО НПП «МедИнж»
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-600">
          Форма официального извещения о нежелательном событии / рекламации медицинского изделия (в рамках ГОСТ ISO 13485 и Приказа Минздрава РФ № 961н).
        </p>
      </div>

      <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="grid grid-cols-4 gap-2">
          {[
            { step: 1, title: 'Изделие' },
            { step: 2, title: 'Инцидент' },
            { step: 3, title: 'Описание' },
            { step: 4, title: 'Файлы' },
          ].map((item) => (
            <div key={item.step} className="flex flex-col items-center text-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold mb-1 transition-colors ${
                  currentStep === item.step
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                    : currentStep > item.step
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {currentStep > item.step ? <CheckCircle2 className="w-4 h-4" /> : item.step}
              </div>
              <span className={`text-[11px] hidden sm:block ${currentStep === item.step ? 'font-semibold text-slate-900' : 'text-slate-500'}`}>
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="mb-6 p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <span className="font-semibold">Требование 152-ФЗ о персональных данных:</span> запрещено вводить ФИО, адрес или паспортные данные пациента. Используйте только обезличенный внутренний код истории болезни ЛПУ.
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <div className="space-y-5">
              <h2 className="text-base font-semibold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" /> Шаг 1. Идентификация изделия и ЛПУ
              </h2>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Медицинское учреждение (ЛПУ) *
                </label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                />
                {errors.organization && <p className="text-red-500 text-xs mt-1">{errors.organization}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Категория изделия</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm bg-white"
                  >
                    <option value="valves">Протезы клапанов сердца</option>
                    <option value="stent_grafts">Стент-графты аорты</option>
                    <option value="coronary_stents">Коронарные стенты</option>
                    <option value="sutures">Хирургический шовный материал</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Модель изделия</label>
                  <input
                    type="text"
                    name="modelName"
                    value={formData.modelName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Типоразмер / Артикул</label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Номер партии (Lot) *</label>
                  <input
                    type="text"
                    name="lotNumber"
                    value={formData.lotNumber}
                    onChange={handleInputChange}
                    placeholder="Указан на стикере"
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 text-xs sm:text-sm ${
                      errors.lotNumber ? 'border-red-500 ring-red-100' : 'border-slate-300 focus:ring-blue-500'
                    }`}
                  />
                  {errors.lotNumber && <p className="text-red-500 text-xs mt-1">{errors.lotNumber}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Серийный номер (SN)</label>
                  <input
                    type="text"
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Дата события *</label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                  />
                  {errors.eventDate && <p className="text-red-500 text-xs mt-1">{errors.eventDate}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Дата имплантации (если была)</label>
                  <input
                    type="date"
                    name="implantationDate"
                    value={formData.implantationDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-5">
              <h2 className="text-base font-semibold text-slate-900 pb-2 border-b border-slate-100">
                Шаг 2. Классификация инцидента и клинический контекст
              </h2>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">Этап выявления проблемы *</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'before_use', title: 'До вскрытия', desc: 'Нарушение стерильности упаковки' },
                    { id: 'intraoperative', title: 'Интраоперационно', desc: 'В момент позиционирования/раскрытия' },
                    { id: 'postoperative', title: 'Послеоперационно', desc: 'В раннем или отдаленном периоде' },
                  ].map((stageItem) => (
                    <label
                      key={stageItem.id}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                        formData.stage === stageItem.id
                          ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-100'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="stage"
                        value={stageItem.id}
                        checked={formData.stage === stageItem.id}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <span className="font-semibold text-xs text-slate-900">{stageItem.title}</span>
                      <span className="text-[10px] text-slate-500 mt-1">{stageItem.desc}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">Степень тяжести последствия *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { val: 'minor', label: 'Без вреда для пациента', color: 'border-emerald-200 text-emerald-800' },
                    { val: 'moderate', label: 'Умеренная (удлинение времени вмешательства)', color: 'border-amber-200 text-amber-800' },
                    { val: 'critical', label: 'Критическая (угроза жизни / повторная экстренная операция)', color: 'border-red-200 text-red-800' },
                    { val: 'fatal', label: 'Летальный исход', color: 'border-slate-400 text-slate-900' },
                  ].map((sev) => (
                    <label
                      key={sev.val}
                      className={`p-3 rounded-xl border cursor-pointer text-xs font-medium transition-all ${
                        formData.severity === sev.val
                          ? 'bg-slate-100 ring-2 ring-slate-800 border-slate-800'
                          : `bg-white ${sev.color} hover:bg-slate-50`
                      }`}
                    >
                      <input
                        type="radio"
                        name="severity"
                        value={sev.val}
                        checked={formData.severity === sev.val}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      {sev.label}
                    </label>
                  ))}
                </div>
                {errors.severity && <p className="text-red-500 text-xs mt-1">{errors.severity}</p>}
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Деперсонализированные сведения о пациенте
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Номер карты / истории болезни *
                    </label>
                    <input
                      type="text"
                      name="patientAnonCode"
                      value={formData.patientAnonCode}
                      onChange={handleInputChange}
                      placeholder="Например, ИБ-4912/26"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    />
                    {errors.patientAnonCode && <p className="text-red-500 text-xs mt-1">{errors.patientAnonCode}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Пол</label>
                    <select
                      name="patientGender"
                      value={formData.patientGender}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    >
                      <option value="">Не указан</option>
                      <option value="male">Мужской</option>
                      <option value="female">Женский</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Возраст (лет)</label>
                    <input
                      type="number"
                      name="patientAge"
                      value={formData.patientAge}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-5">
              <h2 className="text-base font-semibold text-slate-900 pb-2 border-b border-slate-100">
                Шаг 3. Обстоятельства инцидента и статус образца
              </h2>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Подробное описание несоответствия / инцидента *
                </label>
                <textarea
                  name="incidentDescription"
                  rows={4}
                  value={formData.incidentDescription}
                  onChange={handleInputChange}
                  placeholder="Опишите последовательность действий: момент проявления неисправности, поведение створок/каркаса..."
                  className={`w-full px-3 py-2 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-2 ${
                    errors.incidentDescription ? 'border-red-500 ring-red-100' : 'border-slate-300 focus:ring-blue-500'
                  }`}
                />
                {errors.incidentDescription && (
                  <p className="text-red-500 text-xs mt-1">{errors.incidentDescription}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Предпринятые корректирующие меры хирургом
                </label>
                <textarea
                  name="actionsTaken"
                  rows={2}
                  value={formData.actionsTaken}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">
                  Текущий статус изделия *
                </label>
                <div className="space-y-1.5">
                  {[
                    { val: 'explanted_retained', label: 'Эксплантировано и хранится в клинике (готово к передаче на завод)' },
                    { val: 'implanted', label: 'Осталось имплантированным у пациента (под наблюдением)' },
                    { val: 'returned_to_manufacturer', label: 'Уже передано представителю завода' },
                    { val: 'disposed', label: 'Утилизировано по регламенту клиники' },
                  ].map((stat) => (
                    <label
                      key={stat.val}
                      className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs"
                    >
                      <input
                        type="radio"
                        name="deviceStatus"
                        value={stat.val}
                        checked={formData.deviceStatus === stat.val}
                        onChange={handleInputChange}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-slate-800">{stat.label}</span>
                    </label>
                  ))}
                </div>
                {errors.deviceStatus && <p className="text-red-500 text-xs mt-1">{errors.deviceStatus}</p>}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-5">
              <h2 className="text-base font-semibold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" /> Шаг 4. Документы, DICOM и подтверждение
              </h2>

              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors bg-slate-50/50">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs sm:text-sm font-medium text-slate-700">
                  Перетащите файлы сюда или{' '}
                  <label className="text-blue-600 hover:underline cursor-pointer">
                    выберите на диске
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg,.dcm,.zip"
                    />
                  </label>
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  Поддерживаются: DICOM (.dcm, .zip), PDF (протокол операции, акт), фото (до 100 МБ)
                </p>
              </div>

              {formData.files.length > 0 && (
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {formData.files.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-slate-100 rounded-lg text-xs"
                    >
                      <span className="font-medium truncate max-w-xs text-slate-700">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2.5 pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="consentAnonymized"
                    checked={formData.consentAnonymized}
                    onChange={handleInputChange}
                    className="w-4 h-4 mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span className="text-xs text-slate-700 leading-snug">
                    Подтверждаю, что прикрепленные материалы деперсонализированы и не содержат персональных данных пациента согласно 152-ФЗ *
                  </span>
                </label>
                {errors.consentAnonymized && (
                  <p className="text-red-500 text-xs ml-6">{errors.consentAnonymized}</p>
                )}

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="consentAccuracy"
                    checked={formData.consentAccuracy}
                    onChange={handleInputChange}
                    className="w-4 h-4 mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span className="text-xs text-slate-700 leading-snug">
                    Подтверждаю подлинность сведений как оперирующий специалист / уполномоченный представитель клиники *
                  </span>
                </label>
                {errors.consentAccuracy && (
                  <p className="text-red-500 text-xs ml-6">{errors.consentAccuracy}</p>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium text-xs sm:text-sm hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Назад
              </button>
            ) : <div />}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium text-xs sm:text-sm hover:bg-blue-700 flex items-center gap-1.5 transition-colors"
              >
                Далее <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 flex items-center gap-1.5 transition-colors"
              >
                <AlertTriangle className="w-4 h-4" /> Отправить в службу СМК
              </button>
            )}
          </div>
        </form>
      </div>

      {submittedComplaintId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center shadow-xl border border-slate-100">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Рекламация зарегистрирована</h3>
            <p className="text-sm font-semibold text-blue-600 mb-3 tracking-wide">
              Номер дела: {submittedComplaintId}
            </p>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Обращение принято инженерами СМК ЗАО НПП «МедИнж». Первичное заключение будет сформировано в течение 24 часов в личном кабинете.
            </p>
            <button
              onClick={() => {
                setSubmittedComplaintId(null);
                setCurrentStep(1);
                setFormData(initialFormData);
              }}
              className="w-full py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-medium transition-colors"
            >
              Вернуться в личный кабинет
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
