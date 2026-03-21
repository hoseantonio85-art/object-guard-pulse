import { useNavigate } from "react-router-dom";
import {
  X, ChevronRight, AlertTriangle, Info, Shield, FileText,
  Sparkles, Bot, User, Newspaper, Scale, CheckCircle2, Clock,
  ExternalLink, CircleAlert, CircleDot, Target
} from "lucide-react";
import { RiskBadge } from "@/components/RiskBadge";
import { risks, getManifestationsForRisk, typeLabels, typePaths, type RiskLevel } from "@/data/mock";
import { cn } from "@/lib/utils";

/* ─── Source analysis mock data ─── */
interface AnalysisSource {
  type: "law" | "news" | "document" | "ai-agent" | "manual";
  title: string;
  description: string;
  effect: string;
}

const sourceIcons: Record<AnalysisSource["type"], React.ElementType> = {
  law: Scale,
  news: Newspaper,
  document: FileText,
  "ai-agent": Bot,
  manual: User,
};

const sourceLabels: Record<AnalysisSource["type"], string> = {
  law: "Закон",
  news: "Новость",
  document: "Документ",
  "ai-agent": "AI агент",
  manual: "Ручная оценка",
};

const mockSources: Record<string, AnalysisSource[]> = {
  r1: [
    { type: "law", title: "Ужесточение ФЗ-152 о персональных данных", description: "Новые требования к хранению и обработке ПДн вступают в силу с 01.06.2026", effect: "+2 продукта перешли в высокий уровень риска" },
    { type: "ai-agent", title: "NORM AI: переоценка скоринга", description: "Автоматический анализ выявил новые уязвимости в API мобильного банка", effect: "Уровень риска повышен с среднего до высокого" },
    { type: "news", title: "Утечка данных в компании-аналоге", description: "Крупная утечка ПДн в финтех-секторе привлекла внимание регулятора", effect: "Рекомендовано провести внеплановый аудит" },
  ],
  r3: [
    { type: "law", title: "Обновление требований ЦБ", description: "Новые стандарты комплаенс для финансовых организаций", effect: "+1 договор требует проверки" },
    { type: "manual", title: "Аудит отдела комплаенс", description: "Плановая проверка выявила несоответствия в процедурах", effect: "Риск переоценён на основе новых данных" },
  ],
  r5: [
    { type: "ai-agent", title: "NORM AI: bias-тест скоринг-модели", description: "Выявлена систематическая предвзятость в возрастной когорте 18-25", effect: "Модель помечена для переобучения" },
    { type: "document", title: "Отчёт внешнего аудитора", description: "Независимая проверка подтвердила наличие bias", effect: "Уровень риска подтверждён как высокий" },
  ],
};

/* ─── Risk factors & consequences mock ─── */
const riskFactors: Record<string, string[]> = {
  r1: [
    "Нарушение регламентов защиты данных в условиях ужесточения требований ФЗ-420",
    "Зависимость от стабильности работы IT-инфраструктуры",
  ],
  r3: [
    "Частые изменения регуляторных требований",
    "Недостаточная автоматизация комплаенс-процессов",
  ],
  r5: [
    "Недостаточное качество обучающих данных",
    "Отсутствие регулярного bias-тестирования",
  ],
};

const consequences: Record<string, string[]> = {
  r1: [
    "Штраф в размере до 5 000 000 руб. или до 4% годового оборота",
    "Репутационные потери и отток клиентов",
    "Судебные иски от пострадавших клиентов",
    "Временная приостановка лицензии на деятельность",
  ],
  r3: [
    "Штрафные санкции от регулятора",
    "Ограничение деятельности до устранения нарушений",
  ],
  r5: [
    "Дискриминационные решения по кредитным заявкам",
    "Репутационные риски при публичном раскрытии",
  ],
};

/* ─── Recommendations mock ─── */
interface Recommendation {
  text: string;
  action: string;
}

const recommendations: Record<string, Recommendation[]> = {
  r1: [
    { text: "Внедрить автоматизированную систему контроля температурного режима", action: "Снизить риск" },
    { text: "Провести обучение персонала по санитарным нормам", action: "Снизить риск" },
    { text: "Разработать регламент внутренних проверок", action: "Снизить риск" },
  ],
  r3: [
    { text: "Автоматизировать мониторинг регуляторных изменений", action: "Снизить риск" },
  ],
  r5: [
    { text: "Внедрить регулярное bias-тестирование моделей", action: "Снизить риск" },
    { text: "Расширить обучающую выборку", action: "Снизить риск" },
  ],
};

/* ─── Measures mock ─── */
type MeasureStatus = "new" | "implemented";

interface Measure {
  id: string;
  title: string;
  code: string;
  date: string;
  status: MeasureStatus;
}

const measures: Record<string, Measure[]> = {
  r1: [
    { id: "m1", title: "Проведение тестирования на проникновение внешним подрядчиком", code: "MSR-171185", date: "05.03.2024", status: "new" },
    { id: "m2", title: "Обновление политики парольной защиты", code: "MSR-171125", date: "15.01.2024", status: "implemented" },
    { id: "m3", title: "Сегментация сети и разграничение доступа к базам данных", code: "MSR-171185", date: "28.01.2024", status: "implemented" },
    { id: "m4", title: "Внедрение двухфакторной аутентификации для всех сотрудников", code: "MSR-171185", date: "10.02.2024", status: "implemented" },
    { id: "m5", title: "Шифрование данных в состоянии покоя", code: "MSR-171185", date: "20.02.2024", status: "implemented" },
  ],
  r3: [
    { id: "m6", title: "Проведение аудита соответствия ФЗ-152", code: "MSR-171200", date: "01.03.2024", status: "new" },
  ],
  r5: [
    { id: "m7", title: "Запуск bias-тестирования для скоринг-модели", code: "MSR-171210", date: "15.03.2024", status: "new" },
  ],
};

const measureStatusConfig: Record<MeasureStatus, { label: string; className: string }> = {
  new: { label: "Новая", className: "bg-[hsl(200_80%_95%)] text-[hsl(200_80%_40%)]" },
  implemented: { label: "Реализована", className: "bg-[hsl(152_60%_95%)] text-[hsl(152_60%_40%)]" },
};

/* ─── Utilization mock ─── */
interface UtilizationItem {
  label: string;
  amount: string;
  limit: string;
  percent: number;
}

const utilization: Record<string, UtilizationItem[]> = {
  r1: [
    { label: "Прямые потери", amount: "1 340 500 ₽", limit: "12 000 000 ₽", percent: 11 },
    { label: "Косвенные потери", amount: "4 300 000 ₽", limit: "6 000 000 ₽", percent: 72 },
    { label: "Кредитные потери", amount: "250 500 ₽", limit: "1 000 000 000 ₽", percent: 1 },
  ],
};

/* ─── Donut chart component ─── */
function MiniDonut({ percent, size = 40 }: { percent: number; size?: number }) {
  const r = (size - 6) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percent / 100) * circumference;
  const color = percent > 70 ? "hsl(38 92% 50%)" : percent > 30 ? "hsl(200 80% 50%)" : "hsl(152 60% 40%)";

  return (
    <svg width={size} height={size} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--border))" strokeWidth={3} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={3} strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="transition-all duration-700"
      />
    </svg>
  );
}

/* ─── Main Modal Component ─── */
interface RiskDetailModalProps {
  riskId: string;
  onClose: () => void;
}

export function RiskDetailModal({ riskId, onClose }: RiskDetailModalProps) {
  const navigate = useNavigate();
  const risk = risks.find((r) => r.id === riskId);

  if (!risk) return null;

  const manifestationsData = getManifestationsForRisk(risk.id);
  const sources = mockSources[risk.id] || [];
  const factors = riskFactors[risk.id] || [];
  const cons = consequences[risk.id] || [];
  const recs = recommendations[risk.id] || [];
  const riskMeasures = measures[risk.id] || [];
  const util = utilization[risk.id];
  const hasReassessment = sources.some(s => s.effect.includes("переоценён"));

  const highCount = manifestationsData.filter(m => m.level === "high").length;
  const mediumCount = manifestationsData.filter(m => m.level === "medium").length;
  const lowCount = manifestationsData.filter(m => m.level === "low").length;

  const implementedCount = riskMeasures.filter(m => m.status === "implemented").length;
  const effectivenessPercent = riskMeasures.length > 0 ? Math.round((implementedCount / riskMeasures.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-[1320px] max-h-[92vh] mt-[4vh] bg-background rounded-2xl shadow-2xl border border-border flex flex-col animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Fixed Header */}
        <div className="sticky top-0 z-20 bg-background rounded-t-2xl border-b border-border px-8 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium">Риск</span>
              <span className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                risk.level === "high" ? "bg-[hsl(152_60%_95%)] text-[hsl(152_60%_40%)]"
                : "bg-[hsl(200_80%_95%)] text-[hsl(200_80%_40%)]"
              )}>Активен</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">{risk.name}</h1>
              <p className="text-sm text-muted-foreground">Риск информационной безопасности</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 no-scrollbar">
          <div className="flex gap-6 p-8">
            {/* Main column */}
            <div className="flex-1 min-w-0 space-y-8">
              {/* Tabs */}
              <div className="flex items-center justify-between">
                <div className="flex gap-1 border-b border-border">
                  <button className="px-4 py-2 text-sm font-medium text-foreground border-b-2 border-foreground">Оценка риска</button>
                  <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Меры</button>
                </div>
                <button className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <FileText className="h-4 w-4" />
                  Редактировать
                </button>
              </div>

              {/* Risk Level Block */}
              <section className="rounded-xl border border-border bg-card p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-foreground">Уровень риска</span>
                    <RiskBadge level={risk.level} />
                  </div>
                  <button className="text-xs text-[hsl(var(--primary))] hover:underline flex items-center gap-1">
                    Источник анализа <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border border-border p-3">
                    <div className="text-xs text-muted-foreground mb-1">Вероятность</div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className={cn("h-2 w-5 rounded-full", i <= 3 ? "bg-[hsl(38_92%_50%)]" : "bg-muted")} />
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <div className="text-xs text-muted-foreground mb-1">Влияние на компанию</div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className={cn("h-2 w-5 rounded-full", i <= 4 ? "bg-risk-high" : "bg-muted")} />
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <div className="text-xs text-muted-foreground mb-1">Стратегия реагирования</div>
                    <span className="inline-flex items-center rounded-md bg-[hsl(152_60%_95%)] text-[hsl(152_60%_40%)] px-2 py-0.5 text-xs font-medium">Снижение</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-2">Потенциальные потери</div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg border border-border p-3">
                      <div className="text-xs text-muted-foreground mb-1">Прямые</div>
                      <div className="text-sm font-semibold text-foreground">3 420 000 ₽</div>
                    </div>
                    <div className="rounded-lg border border-border p-3">
                      <div className="text-xs text-muted-foreground mb-1">Косвенные</div>
                      <div className="text-sm font-semibold text-foreground">3 420 000 ₽</div>
                    </div>
                    <div className="rounded-lg border border-border p-3">
                      <div className="text-xs text-muted-foreground mb-1">Кредитные</div>
                      <div className="text-sm font-semibold text-foreground">3 420 000 ₽</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Utilization */}
              {util && (
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-foreground">Утилизация лимита</h2>
                    <button className="text-muted-foreground hover:text-foreground">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {util.map((item, i) => (
                      <div key={i} className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
                        <MiniDonut percent={item.percent} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-muted-foreground">{item.label}</span>
                            <span className="text-xs font-semibold text-foreground">{item.percent}%</span>
                          </div>
                          <div className="text-sm font-semibold text-foreground">{item.amount}</div>
                          <div className="text-xs text-muted-foreground">{item.limit}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Key Risk Indicator */}
              <section className="space-y-3">
                <h2 className="text-sm font-semibold text-foreground">Ключевой индикатор риска</h2>
                <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <CircleAlert className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-foreground">Контрольное значение превышено</span>
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <span className="text-xs text-muted-foreground">Требует немедленных мер и эскалации</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-risk-high">0,11%</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </section>

              {/* Where it manifests */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h2 className="text-sm font-semibold text-foreground">Где проявляется</h2>
                    <span className="text-xs text-muted-foreground">{manifestationsData.length} объектов</span>
                  </div>
                  {manifestationsData.length > 0 && (
                    <div className="flex items-center gap-2">
                      {highCount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-risk-high-bg text-risk-high px-2 py-0.5 text-xs font-medium">
                          High {highCount}
                        </span>
                      )}
                      {mediumCount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-risk-medium-bg text-risk-medium px-2 py-0.5 text-xs font-medium">
                          Medium {mediumCount}
                        </span>
                      )}
                      {lowCount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-risk-low-bg text-risk-low px-2 py-0.5 text-xs font-medium">
                          Low {lowCount}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {manifestationsData.length > 0 ? (
                  <div className="space-y-2">
                    {manifestationsData.map((m, i) => (
                      <div
                        key={i}
                        onClick={() => { onClose(); navigate(`/objects/${typePaths[m.object.type]}/${m.object.id}`); }}
                        className="flex items-center justify-between rounded-xl border border-border bg-card p-4 cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-foreground">{m.object.name}</span>
                          <span className="text-xs text-muted-foreground">{typeLabels[m.object.type]}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">Вклад: {Math.round((1 / manifestationsData.length) * 100)}%</span>
                          <RiskBadge level={m.level} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-border bg-card p-8 text-center">
                    <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                      <Target className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">Проявления не обнаружены</p>
                    <p className="text-xs text-muted-foreground mb-4">Риск оценён на основе внешних факторов или ещё не проведена оценка объектов</p>
                    <button className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors">
                      Проверить объекты
                    </button>
                  </div>
                )}
              </section>

              {/* Analysis Sources */}
              {sources.length > 0 && (
                <section className="space-y-3">
                  <h2 className="text-sm font-semibold text-foreground">Источники анализа</h2>
                  {hasReassessment && (
                    <div className="flex items-center gap-2 rounded-lg bg-[hsl(38_92%_95%)] border border-[hsl(38_92%_85%)] px-4 py-2.5">
                      <Sparkles className="h-4 w-4 text-[hsl(38_92%_50%)]" />
                      <span className="text-sm text-[hsl(38_92%_40%)]">Риск переоценён на основе новых данных</span>
                    </div>
                  )}
                  <div className="space-y-2">
                    {sources.map((source, i) => {
                      const Icon = sourceIcons[source.type];
                      return (
                        <div key={i} className="rounded-xl border border-border bg-card p-4 hover:shadow-sm transition-shadow">
                          <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                              <Icon className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs text-muted-foreground font-medium">{sourceLabels[source.type]}</span>
                              </div>
                              <h4 className="text-sm font-medium text-foreground mb-0.5">{source.title}</h4>
                              <p className="text-xs text-muted-foreground leading-relaxed mb-2">{source.description}</p>
                              <div className="inline-flex items-center gap-1.5 rounded-md bg-[hsl(270_60%_95%)] text-[hsl(270_60%_40%)] px-2.5 py-1 text-xs font-medium">
                                <Sparkles className="h-3 w-3" />
                                {source.effect}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Description */}
              <section className="space-y-3">
                <h2 className="text-sm font-semibold text-foreground">Описание риска</h2>
                <p className="text-sm text-foreground leading-relaxed">{risk.description}</p>
              </section>

              {/* Risk Factors */}
              {factors.length > 0 && (
                <section className="space-y-3">
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">Риск-факторы</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Это причины, которые могут привести к реализации риска.</p>
                  </div>
                  <div className="space-y-2">
                    {factors.map((f, i) => (
                      <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                        <div className="h-6 w-6 rounded-full bg-[hsl(200_80%_95%)] flex items-center justify-center shrink-0 mt-0.5">
                          <Info className="h-3.5 w-3.5 text-[hsl(200_80%_50%)]" />
                        </div>
                        <span className="text-sm text-foreground">{f}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Consequences */}
              {cons.length > 0 && (
                <section className="space-y-3">
                  <h2 className="text-sm font-semibold text-foreground">Возможные последствия</h2>
                  <div className="space-y-2">
                    {cons.map((c, i) => (
                      <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                        <div className="h-6 w-6 rounded-full bg-risk-high-bg flex items-center justify-center shrink-0 mt-0.5">
                          <AlertTriangle className="h-3.5 w-3.5 text-risk-high" />
                        </div>
                        <span className="text-sm text-foreground">{c}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Recommendations */}
              {recs.length > 0 && (
                <section className="space-y-3">
                  <h2 className="text-sm font-semibold text-foreground">Рекомендации</h2>
                  <div className="space-y-2">
                    {recs.map((rec, i) => (
                      <div key={i} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                        <div className="flex items-center gap-3">
                          <Sparkles className="h-4 w-4 text-[hsl(270_60%_50%)]" />
                          <span className="text-sm text-foreground">{rec.text}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground font-medium">{rec.action}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Measures */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-foreground">Меры</h2>
                  <button className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Добавить меру <span className="text-lg leading-none">+</span>
                  </button>
                </div>
                <div className="flex items-center gap-4 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Текущая эффективность мер</span>
                    <Info className="h-3 w-3 text-muted-foreground" />
                    <span className="inline-flex items-center rounded-full bg-[hsl(200_80%_95%)] text-[hsl(200_80%_40%)] px-2 py-0.5 text-xs font-semibold">{effectivenessPercent}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Годовая эффективность мер</span>
                    <Info className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Пока нет данных</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {riskMeasures.map((measure) => (
                    <div key={measure.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                      <div className="flex items-center gap-3">
                        <CircleDot className={cn("h-4 w-4", measure.status === "implemented" ? "text-[hsl(152_60%_40%)]" : "text-[hsl(200_80%_50%)]")} />
                        <div>
                          <div className="text-sm font-medium text-foreground">{measure.title}</div>
                          <div className="text-xs text-muted-foreground">{measure.code} · {measure.status === "new" ? "Плановая" : "Фактическая"} дата: {measure.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", measureStatusConfig[measure.status].className)}>
                          {measureStatusConfig[measure.status].label}
                        </span>
                        <Shield className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Organization */}
              <section className="space-y-3 pb-4">
                <h2 className="text-sm font-semibold text-foreground">Подразделение владельца риска</h2>
                <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                    <CircleDot className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="text-sm text-foreground">ДубльКИС / Департамент исследований и разработок / Управление информационных технологий / Отдел технического сопровождения</span>
                </div>
              </section>
            </div>

            {/* Right sidebar */}
            <div className="w-[260px] shrink-0 space-y-4">
              {/* Info card */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Информация</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-muted-foreground">Риск</span><span className="font-medium text-foreground font-mono">RSK-41242001</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Создан</span><span className="text-foreground">01 февраля 2024</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Обновлён</span><span className="text-foreground">01 февраля 2024</span></div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Автор</span>
                    <span className="flex items-center gap-1.5 text-foreground">
                      <span className="h-4 w-4 rounded-full bg-[hsl(152_60%_40%)] flex items-center justify-center"><Bot className="h-2.5 w-2.5 text-white" /></span>
                      NORM AI
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Источник</span>
                    <span className="flex items-center gap-1.5 text-foreground">
                      <span className="h-4 w-4 rounded-full bg-[hsl(200_80%_50%)] flex items-center justify-center text-white text-[8px] font-bold">AC</span>
                      АС Сенат
                    </span>
                  </div>
                </div>
              </div>

              {/* Assessment object */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-2">
                <h3 className="text-sm font-semibold text-foreground">Объект оценки</h3>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[hsl(152_60%_40%)]" />
                  <span className="text-xs text-foreground">Проект</span>
                </div>
                <p className="text-xs text-muted-foreground">Петрушины истории и многое …</p>
              </div>

              {/* History */}
              <button className="w-full flex items-center justify-between rounded-xl border border-border bg-card p-5 hover:shadow-sm transition-shadow">
                <span className="text-sm font-medium text-foreground">История изменений</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>

              {/* Add measure */}
              <button className="w-full flex items-center justify-between rounded-xl border border-border bg-card p-5 hover:shadow-sm transition-shadow">
                <span className="text-sm font-medium text-foreground">Добавить меру</span>
                <span className="text-lg text-muted-foreground">+</span>
              </button>
            </div>
          </div>

          {/* Bottom actions */}
          <div className="border-t border-border px-8 py-4 flex items-center justify-between">
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">Удалить</button>
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">В архив</button>
          </div>
        </div>
      </div>
    </div>
  );
}
