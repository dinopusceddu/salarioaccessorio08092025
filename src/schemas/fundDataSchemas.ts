// src/schemas/fundDataSchemas.ts
import { z } from 'zod';
import { AreaQualifica, EmployeeCategory, LivelloPeo, TipologiaEnte, TipoMaggiorazione, UserRole } from '../enums.ts';

const numberOrUndefined = z.preprocess(
  (val) => (val === '' || val === null ? undefined : Number(val)),
  z.number().optional()
);

// Enums
export const UserRoleSchema = z.nativeEnum(UserRole);
export const EmployeeCategorySchema = z.nativeEnum(EmployeeCategory);
export const TipologiaEnteSchema = z.nativeEnum(TipologiaEnte);
export const LivelloPeoSchema = z.nativeEnum(LivelloPeo);
export const AreaQualificaSchema = z.nativeEnum(AreaQualifica);
export const TipoMaggiorazioneSchema = z.nativeEnum(TipoMaggiorazione);

// Schemas
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: UserRoleSchema,
});

export const NormativeDataSchema = z.object({
  valori_pro_capite: z.object({
    art67_ccnl_2018: z.number(),
    art79_ccnl_2022_b: z.number(),
  }),
  limiti: z.object({
    incidenza_salario_accessorio: z.number(),
    incremento_virtuosi_dl25_2025: z.number(),
    incremento_pnrr_dl13_2023: z.number(),
  }),
  // FIX: Corrected z.record to have two arguments (key and value schema).
  riferimenti_normativi: z.record(z.string(), z.string()),
  progression_economic_values: z.record(z.string(), z.record(z.string(), z.number())),
  indennita_comparto_values: z.record(z.string(), z.number()),
});

export const HistoricalDataSchema = z.object({
  fondoSalarioAccessorioPersonaleNonDirEQ2016: numberOrUndefined,
  fondoElevateQualificazioni2016: numberOrUndefined,
  fondoDirigenza2016: numberOrUndefined,
  risorseSegretarioComunale2016: numberOrUndefined,
  personaleServizio2018: numberOrUndefined,
  spesaStipendiTabellari2023: numberOrUndefined,
  includeDifferenzialiStipendiali2023: z.boolean().optional(),
  fondoPersonaleNonDirEQ2018_Art23: numberOrUndefined,
  fondoEQ2018_Art23: numberOrUndefined,
  totaleFondoAnnoPrecedente: numberOrUndefined,
});

export const Art23EmployeeDetailSchema = z.object({
  id: z.string(),
  matricola: z.string().optional(),
  partTimePercentage: numberOrUndefined,
  cedoliniEmessi: numberOrUndefined,
});

export const ProventoSpecificoSchema = z.object({
  id: z.string(),
  descrizione: z.string(),
  importo: numberOrUndefined,
  riferimentoNormativo: z.string(),
});

export const SimulatoreIncrementoInputSchema = z.object({
  simStipendiTabellari2023: numberOrUndefined,
  simFondoStabileAnnoApplicazione: numberOrUndefined,
  simRisorsePOEQAnnoApplicazione: numberOrUndefined,
  simSpesaPersonaleConsuntivo2023: numberOrUndefined,
  simMediaEntrateCorrenti2021_2023: numberOrUndefined,
  simTettoSpesaPersonaleL296_06: numberOrUndefined,
  simCostoAnnuoNuoveAssunzioniPIAO: numberOrUndefined,
  simPercentualeOneriIncremento: numberOrUndefined,
});

export const SimulatoreIncrementoRisultatiSchema = z.object({
    fase1_obiettivo48: numberOrUndefined,
    fase1_fondoAttualeComplessivo: numberOrUndefined,
    fase1_incrementoPotenzialeLordo: numberOrUndefined,
    fase2_spesaPersonaleAttualePrevista: numberOrUndefined,
    fase2_sogliaPercentualeDM17_03_2020: numberOrUndefined,
    fase2_limiteSostenibileDL34: numberOrUndefined,
    fase2_spazioDisponibileDL34: numberOrUndefined,
    fase3_margineDisponibileL296_06: numberOrUndefined,
    fase4_spazioUtilizzabileLordo: numberOrUndefined,
    fase5_incrementoNettoEffettivoFondo: numberOrUndefined,
});

export const AnnualEmployeeCountSchema = z.object({
    category: EmployeeCategorySchema,
    count: numberOrUndefined,
});

export const AnnualDataSchema = z.object({
  annoRiferimento: z.number(),
  denominazioneEnte: z.string().optional(),
  tipologiaEnte: TipologiaEnteSchema.optional(),
  altroTipologiaEnte: z.string().optional(),
  numeroAbitanti: numberOrUndefined,
  isEnteDissestato: z.boolean().optional(),
  isEnteStrutturalmenteDeficitario: z.boolean().optional(),
  isEnteRiequilibrioFinanziario: z.boolean().optional(),
  hasDirigenza: z.boolean().optional(),
  isDistributionMode: z.boolean().optional(),
  personaleServizioAttuale: z.array(AnnualEmployeeCountSchema),
  rispettoEquilibrioBilancioPrecedente: z.boolean().optional(),
  rispettoDebitoCommercialePrecedente: z.boolean().optional(),
  incidenzaSalarioAccessorioUltimoRendiconto: numberOrUndefined,
  approvazioneRendicontoPrecedente: z.boolean().optional(),
  proventiSpecifici: z.array(ProventoSpecificoSchema),
  incentiviPNRROpMisureStraordinarie: numberOrUndefined,
  condizioniVirtuositaFinanziariaSoddisfatte: z.boolean().optional(),
  personale2018PerArt23: z.array(Art23EmployeeDetailSchema),
  personaleAnnoRifPerArt23: z.array(Art23EmployeeDetailSchema),
  simulatoreInput: SimulatoreIncrementoInputSchema,
  simulatoreRisultati: SimulatoreIncrementoRisultatiSchema.optional(),
  fondoStabile2016PNRR: numberOrUndefined,
  calcolatoIncrementoPNRR3: numberOrUndefined,
  fondoLavoroStraordinario: numberOrUndefined,
}).refine(data => data.tipologiaEnte !== TipologiaEnte.ALTRO || (data.altroTipologiaEnte && data.altroTipologiaEnte.length > 0), {
    message: "Specificare la tipologia di ente",
    path: ["altroTipologiaEnte"],
});

export const FondoDataBaseSchema = z.object({
    st_art79c1_art67c1_unicoImporto2017: numberOrUndefined,
    st_art79c1_art67c1_alteProfessionalitaNonUtil: numberOrUndefined,
    st_art79c1_art67c2a_incr8320: numberOrUndefined,
    st_art79c1_art67c2b_incrStipendialiDiff: numberOrUndefined,
    st_art79c1_art4c2_art67c2c_integrazioneRIA: numberOrUndefined,
    st_art79c1_art67c2d_risorseRiassorbite165: numberOrUndefined,
    st_art79c1_art15c1l_art67c2e_personaleTrasferito: numberOrUndefined,
    st_art79c1_art15c1i_art67c2f_regioniRiduzioneDirig: numberOrUndefined,
    st_art79c1_art14c3_art67c2g_riduzioneStraordinario: numberOrUndefined,
    st_taglioFondoDL78_2010: numberOrUndefined,
    st_riduzioniPersonaleATA_PO_Esternalizzazioni: numberOrUndefined,
    st_art67c1_decurtazionePO_AP_EntiDirigenza: numberOrUndefined,
    st_art79c1b_euro8450: numberOrUndefined,
    st_art79c1c_incrementoStabileConsistenzaPers: numberOrUndefined,
    st_art79c1d_differenzialiStipendiali2022: numberOrUndefined,
    st_art79c1bis_diffStipendialiB3D3: numberOrUndefined,
    st_incrementoDecretoPA: numberOrUndefined,
    st_riduzionePerIncrementoEQ: numberOrUndefined,
    vs_art4c3_art15c1k_art67c3c_recuperoEvasione: numberOrUndefined,
    vs_art4c2_art67c3d_integrazioneRIAMensile: numberOrUndefined,
    vs_art67c3g_personaleCaseGioco: numberOrUndefined,
    vs_art79c2b_max1_2MonteSalari1997: numberOrUndefined,
    vs_art67c3k_integrazioneArt62c2e_personaleTrasferito: numberOrUndefined,
    vs_art79c2c_risorseScelteOrganizzative: numberOrUndefined,
    cl_totaleParzialeRisorsePerConfrontoTetto2016: numberOrUndefined,
    cl_art23c2_decurtazioneIncrementoAnnualeTetto2016: numberOrUndefined,
    vn_art15c1d_art67c3a_sponsorConvenzioni: numberOrUndefined,
    vn_art54_art67c3f_rimborsoSpeseNotifica: numberOrUndefined,
    vn_art15c1k_art16_dl98_art67c3b_pianiRazionalizzazione: numberOrUndefined,
    vn_art15c1k_art67c3c_incentiviTecniciCondoni: numberOrUndefined,
    vn_art18h_art67c3c_incentiviSpeseGiudizioCensimenti: numberOrUndefined,
    vn_art15c1m_art67c3e_risparmiStraordinario: numberOrUndefined,
    vn_art67c3j_regioniCittaMetro_art23c4_incrPercentuale: numberOrUndefined,
    vn_art80c1_sommeNonUtilizzateStabiliPrec: numberOrUndefined,
    vn_l145_art1c1091_incentiviRiscossioneIMUTARI: numberOrUndefined,
    vn_l178_art1c870_risparmiBuoniPasto2020: numberOrUndefined,
    vn_dl135_art11c1b_risorseAccessorieAssunzioniDeroga: numberOrUndefined,
    vn_art79c3_022MonteSalari2018_da2022Proporzionale: numberOrUndefined,
    vn_art79c1b_euro8450_unaTantum2021_2022: numberOrUndefined,
    vn_art79c3_022MonteSalari2018_da2022UnaTantum2022: numberOrUndefined,
    vn_dl13_art8c3_incrementoPNRR_max5stabile2016: numberOrUndefined,
    fin_art4_dl16_misureMancatoRispettoVincoli: numberOrUndefined,
});

export const FondoElevateQualificazioniDataSchema = z.object({
    ris_fondoPO2017: numberOrUndefined,
    ris_incrementoConRiduzioneFondoDipendenti: numberOrUndefined,
    ris_incrementoLimiteArt23c2_DL34: numberOrUndefined,
    ris_incremento022MonteSalari2018: numberOrUndefined,
    fin_art23c2_adeguamentoTetto2016: numberOrUndefined,
    st_art17c2_retribuzionePosizione: numberOrUndefined,
    st_art17c3_retribuzionePosizioneArt16c4: numberOrUndefined,
    st_art17c5_interimEQ: numberOrUndefined,
    st_art23c5_maggiorazioneSedi: numberOrUndefined,
    va_art17c4_retribuzioneRisultato: numberOrUndefined,
});

export const FondoSegretarioComunaleDataSchema = z.object({
    st_art3c6_CCNL2011_retribuzionePosizione: numberOrUndefined,
    st_art58c1_CCNL2024_differenzialeAumento: numberOrUndefined,
    st_art60c1_CCNL2024_retribuzionePosizioneClassi: numberOrUndefined,
    st_art60c3_CCNL2024_maggiorazioneComplessita: numberOrUndefined,
    st_art60c5_CCNL2024_allineamentoDirigEQ: numberOrUndefined,
    st_art56c1g_CCNL2024_retribuzioneAggiuntivaConvenzioni: numberOrUndefined,
    st_art56c1h_CCNL2024_indennitaReggenzaSupplenza: numberOrUndefined,
    va_art56c1f_CCNL2024_dirittiSegreteria: numberOrUndefined,
    va_art56c1i_CCNL2024_altriCompensiLegge: numberOrUndefined,
    va_art8c3_DL13_2023_incrementoPNRR: numberOrUndefined,
    va_art61c2_CCNL2024_retribuzioneRisultato10: numberOrUndefined,
    va_art61c2bis_CCNL2024_retribuzioneRisultato15: numberOrUndefined,
    va_art61c2ter_CCNL2024_superamentoLimiteMetropolitane: numberOrUndefined,
    va_art61c3_CCNL2024_incremento022MonteSalari2018: numberOrUndefined,
    fin_totaleRisorseRilevantiLimite: numberOrUndefined,
    fin_percentualeCoperturaPostoSegretario: numberOrUndefined,
});

export const FondoDirigenzaDataSchema = z.object({
    st_art57c2a_CCNL2020_unicoImporto2020: numberOrUndefined,
    st_art57c2a_CCNL2020_riaPersonaleCessato2020: numberOrUndefined,
    st_art56c1_CCNL2020_incremento1_53MonteSalari2015: numberOrUndefined,
    st_art57c2c_CCNL2020_riaCessatidallAnnoSuccessivo: numberOrUndefined,
    st_art57c2e_CCNL2020_risorseAutonomeStabili: numberOrUndefined,
    st_art39c1_CCNL2024_incremento2_01MonteSalari2018: numberOrUndefined,
    va_art57c2b_CCNL2020_risorseLeggeSponsor: numberOrUndefined,
    va_art57c2d_CCNL2020_sommeOnnicomprensivita: numberOrUndefined,
    va_art57c2e_CCNL2020_risorseAutonomeVariabili: numberOrUndefined,
    va_art57c3_CCNL2020_residuiAnnoPrecedente: numberOrUndefined,
    va_dl13_2023_art8c3_incrementoPNRR: numberOrUndefined,
    va_art39c1_CCNL2024_recupero0_46MonteSalari2018_2020: numberOrUndefined,
    va_art39c1_CCNL2024_recupero2_01MonteSalari2018_2021_2023: numberOrUndefined,
    va_art39c2_CCNL2024_incremento0_22MonteSalari2018_valorizzazione: numberOrUndefined,
    va_art33c2_DL34_2019_incrementoDeroga: numberOrUndefined,
    lim_totaleParzialeRisorseConfrontoTetto2016: numberOrUndefined,
    lim_art23c2_DLGS75_2017_adeguamentoAnnualeTetto2016: numberOrUndefined,
    lim_art4_DL16_2014_misureMancatoRispettoVincoli: numberOrUndefined,
});

export const RisorsaVariabileDetailSchema = z.object({
    stanziate: numberOrUndefined,
    risparmi: numberOrUndefined,
    aBilancio: numberOrUndefined,
});

export const DistribuzioneRisorseDataSchema = z.object({
    u_diffProgressioniStoriche: numberOrUndefined,
    u_indennitaComparto: numberOrUndefined,
    u_incrIndennitaEducatori: RisorsaVariabileDetailSchema.optional(),
    u_incrIndennitaScolastico: RisorsaVariabileDetailSchema.optional(),
    u_indennitaEx8QF: RisorsaVariabileDetailSchema.optional(),
    p_performanceOrganizzativa: RisorsaVariabileDetailSchema.optional(),
    p_performanceIndividuale: RisorsaVariabileDetailSchema.optional(),
    p_maggiorazionePerformanceIndividuale: RisorsaVariabileDetailSchema.optional(),
    p_indennitaCondizioniLavoro: RisorsaVariabileDetailSchema.optional(),
    p_indennitaTurno: RisorsaVariabileDetailSchema.optional(),
    p_indennitaReperibilita: RisorsaVariabileDetailSchema.optional(),
    p_indennitaLavoroGiornoRiposo: RisorsaVariabileDetailSchema.optional(),
    p_compensiSpecificheResponsabilita: RisorsaVariabileDetailSchema.optional(),
    p_indennitaFunzione: RisorsaVariabileDetailSchema.optional(),
    p_indennitaServizioEsterno: RisorsaVariabileDetailSchema.optional(),
    p_obiettiviPoliziaLocale: RisorsaVariabileDetailSchema.optional(),
    p_incentiviContoTerzi: RisorsaVariabileDetailSchema.optional(),
    p_compensiAvvocatura: RisorsaVariabileDetailSchema.optional(),
    p_incentiviCondonoFunzioniTecnichePre2018: RisorsaVariabileDetailSchema.optional(),
    p_incentiviFunzioniTecnichePost2018: RisorsaVariabileDetailSchema.optional(),
    p_incentiviIMUTARI: RisorsaVariabileDetailSchema.optional(),
    p_compensiMessiNotificatori: RisorsaVariabileDetailSchema.optional(),
    p_compensiCaseGioco: RisorsaVariabileDetailSchema.optional(),
    p_compensiCaseGiocoNonCoperti: RisorsaVariabileDetailSchema.optional(),
    p_diffStipendialiAnniPrec: RisorsaVariabileDetailSchema.optional(),
    p_diffStipendialiAnnoCorrente: RisorsaVariabileDetailSchema.optional(),
    p_pianiWelfare: RisorsaVariabileDetailSchema.optional(),
    criteri_isConsuntivoMode: z.boolean().optional(),
    criteri_percPerfIndividuale: numberOrUndefined,
    criteri_percMaggiorazionePremio: numberOrUndefined,
    criteri_percDipendentiBonus: numberOrUndefined,
});

export const PersonaleServizioDettaglioSchema = z.object({
    id: z.string(),
    matricola: z.string().optional(),
    partTimePercentage: numberOrUndefined,
    fullYearService: z.boolean(),
    assunzioneDate: z.string().optional(),
    cessazioneDate: z.string().optional(),
    livelloPeoStoriche: LivelloPeoSchema.optional(),
    numeroDifferenziali: numberOrUndefined,
    tipoMaggiorazione: TipoMaggiorazioneSchema.optional(),
    areaQualifica: AreaQualificaSchema.optional(),
});

export const FundDataSchema = z.object({
  historicalData: HistoricalDataSchema,
  annualData: AnnualDataSchema,
  fondoAccessorioDipendenteData: FondoDataBaseSchema,
  fondoElevateQualificazioniData: FondoElevateQualificazioniDataSchema,
  fondoSegretarioComunaleData: FondoSegretarioComunaleDataSchema,
  fondoDirigenzaData: FondoDirigenzaDataSchema,
  distribuzioneRisorseData: DistribuzioneRisorseDataSchema,
});