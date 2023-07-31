import { useRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor';
import { antimonyLanguage } from '../languages/AntimonyLanguage';
import { antimonyTheme } from '../languages/AntimonyTheme';
import { Tabs } from './Tabs'
import { Uri } from 'monaco-editor';
import {FileTreeEntry, SaveFileArgs} from "../fileexplorer/typedefs";
import EventEmitter from "eventemitter3";
// import parseAntimonyModel from '../languages/AntimonyParser'
import { parseAntimonyModel } from '../languages/AntimonyParser'
import { hover } from '@testing-library/user-event/dist/hover';


type Monaco = typeof monaco

type Props = {
  emitter: EventEmitter<string | symbol, any>;
}

let origAnt = [
  '// Created by libAntimony v2.12.0.3',
  'model *BIOMD0000000001()',
  '',
  '  // Compartments and Species:',
  '  compartment comp1;',
  '  species BLL in comp1, IL in comp1, AL in comp1, A in comp1, BL in comp1;',
  '  species B in comp1, DLL in comp1, D in comp1, ILL in comp1, DL in comp1;',
  '  species I in comp1, ALL in comp1, BwLL;',
  '',
  '  // Reactions:',
  '  React0: B -> BL; comp1*(kf_0*B - kr_0*BL);',
  '  React1: BL -> BLL; comp1*(kf_1*BL - kr_1*BLL);',
  '  React2: BwLL -> ALL; comp1*(kf_2*BLL - kr_2*ALL);',
  '  React3: A -> AL; comp1*(kf_3*A - kr_3*AL);',
  '  React4: AL -> ALL; comp1*(kf_4*AL - kr_4*ALL);',
  '  React5: B -> A; comp1*(kf_5*B - kr_5*A);',
  '  React6: BL -> AL; comp1*(kf_6*BL - kr_6*AL);',
  '  React7: I -> IL; comp1*(kf_7*I - kr_7*IL);',
  '  React8: IL -> ILL; comp1*(kf_8*IL - kr_8*ILL);',
  '  React9: A -> I; comp1*(kf_9*A - kr_9*I);',
  '  React10: AL -> IL; comp1*(kf_10*AL - kr_10*IL);',
  '  React11: ALL -> ILL; comp1*(kf_11*ALL - kr_11*ILL);',
  '  React12: D -> DL; comp1*(kf_12*D - kr_12*DL);',
  '  React13: DL -> DLL; comp1*(kf_13*DL - kr_13*DLL);',
  '  React14: I -> D; comp1*(kf_14*I - kr_14*D);',
  '  React15: IL -> DL; comp1*(kf_15*IL - kr_15*DL);',
  '  React16: ILL -> DLL; comp1*(kf_16*ILL - kr_16*DLL);',
  '',
  '  // Events:',
  '  RemovalACh: at time > t2: kf_13 = 0, kf_8 = 0, kf_4 = 0, kf_1 = 0, kf_12 = 0, kf_7 = 0, kf_3 = 0, kf_0 = 0;',
  '',
  '  // Species initializations:',
  '  BLL = 0;',
  '  IL = 0;',
  '  AL = 0;',
  '  A = 0;',
  '  BL = 0;',
  '  B = 1.66057788110262e-21/comp1;',
  '  DLL = 0;',
  '  D = 0;',
  '  ILL = 0;',
  '  DL = 0;',
  '  I = 0;',
  '  ALL = 0;',
  '  BwLL = 3;',
  '',
  '  // Compartment initializations:',
  '  comp1 = 1e-16;',
  '',
  '  // Variable initializations:',
  '  t2 = 20;',
  '  kf_0 = 30002;',
  '  kf_3 = 3000;',
  '  kf_7 = 3000;',
  '  kf_12 = 3000;',
  '  kf_1 = 1500;',
  '  kf_4 = 1500;',
  '  kf_8 = 1500;',
  '  kf_13 = 1500;',
  '  kr_0 = 8000;',
  '  kr_1 = 16000;',
  '  kf_2 = 30000;',
  '  kr_2 = 700;',
  '  kr_3 = 8.64;',
  '  kr_4 = 17.28;',
  '  kf_5 = 0.54;',
  '  kr_5 = 10800;',
  '  kf_6 = 130;',
  '  kr_6 = 2740;',
  '  kr_7 = 4;',
  '  kr_8 = 8;',
  '  kf_9 = 19.7;',
  '  kr_9 = 3.74;',
  '  kf_10 = 19.85;',
  '  kr_10 = 1.74;',
  '  kf_11 = 20;',
  '  kr_11 = 0.81;',
  '  kr_12 = 4;',
  '  kr_13 = 8;',
  '  kf_14 = 0.05;',
  '  kr_14 = 0.0012;',
  '  kf_15 = 0.05;',
  '  kr_15 = 0.0012;',
  '  kf_16 = 0.05;',
  '  kr_16 = 0.0012;',

  '  // Other declarations:',
  '  var kf_0, kf_3, kf_7, kf_12, kf_1, kf_4, kf_8, kf_13;',
  '  const comp1, t2, kr_0, kr_1, kf_2, kr_2, kr_3, kr_4, kf_5, kr_5, kf_6, kr_6;',
  '  const kr_7, kr_8, kf_9, kr_9, kf_10, kr_10, kf_11, kr_11, kr_12, kr_13;',
  '  const kf_14, kr_14, kf_15, kr_15, kf_16, kr_16;',
  '',
  '  // Display Names:',
  '  comp1 is "compartment1;"',
  '  BLL is "BasalACh2;"',
  '  IL is "IntermediateACh;"',
  '  AL is "ActiveACh;"',
  '  A is "Active;"',
  '  BL is "BasalACh;"',
  '  B is "Basal;"',
  '  DLL is "DesensitisedACh2;"',
  '  D is "Desensitised;"',
  '  ILL is "IntermediateACh2;"',
  '  DL is "DesensitisedACh;"',
  '  I is "Intermediate;"',
  '  ALL is "ActiveACh2;"',
  '  RemovalACh is "removal of ACh;"',
  '',
  '',
  '  BLL identity "http://identifiers.org/chebi/CHEBI:27732"',
  'end'
].join('\n')

let newAnt = `
// Created by libAntimony v2.13.2
function Constant_flux__irreversible(v)
  v;
end

Constant_flux__irreversible is "Constant flux (irreversible)"

function Function_for_Tumor_Growth_1(a, T_1, b)
  a*T_1*(1 - b*T_1);
end

Function_for_Tumor_Growth_1 is "Function_for_Tumor_Growth_1"

function Function_for_E1_Depletion(c_3, T_1, T_2, E_1)
  c_3*(T_1 + T_2)*E_1;
end

Function_for_E1_Depletion is "Function_for_E1_Depletion"

function Function_for_Tumor_Killing_T1_E1(mu, E_1, T_1)
  mu*E_1*T_1;
end

Function_for_Tumor_Killing_T1_E1 is "Function_for_Tumor_Killing_T1_E1"

function Function_for_E2_Recruitment(d_1, T_1, E_1)
  d_1*T_1*E_1;
end

Function_for_E2_Recruitment is "Function_for_E2_Recruitment"

function Function_for_E2_Depletion(d_2, T_1, E_2)
  d_2*T_1*E_2;
end

Function_for_E2_Depletion is "Function_for_E2_Depletion"

function Function_for_Tumor_Competition_1(nu, T_1, T_2)
  nu*T_1*T_2;
end

Function_for_Tumor_Competition_1 is "Function_for_Tumor_Competition_1"

function Function_for_E1_Recruitment(c_4, T_1, s, T_2, E_1, c_5)
  c_4*(T_1 + s*T_2)*E_1/(c_5 + T_1 + T_2);
end

Function_for_E1_Recruitment is "Function_for_E1_Recruitment"

function Function_for_Tumor_Killing_T1_E2(beta, E_2, T_1)
  beta*E_2*T_1;
end

Function_for_Tumor_Killing_T1_E2 is "Function_for_Tumor_Killing_T1_E2"

function Function_for_Tumor_Killing_T2_E1(q, E_1, T_2, mu)
  mu*q*E_1*T_2;
end

Function_for_Tumor_Killing_T2_E1 is "Function_for_Tumor_Killing_T2_E1"

function Function_for_Tumor_Competition_2(r, nu, T_1, T_2)
  r*nu*T_1*T_2;
end

Function_for_Tumor_Competition_2 is "Function_for_Tumor_Competition_2"

function Function_for_Tumor_Growth_2(a, p, T_2, b)
  a*p*T_2*(1 - b*T_2);
end

Function_for_Tumor_Growth_2 is "Function_for_Tumor_Growth_2"


model *Alvarez2019___A_nonlinear_mathematical_model_of_cell_mediated_immune_response_for_tumor_phenotypic_heterogeneity()

  // Compartments and Species:
  compartment compartment_;
  species T_1 in compartment_, T_2 in compartment_, E_1_Innate in compartment_;
  species E_2_Adaptive in compartment_;

  // Assignment Rules:
  T_Total := T_1 + T_2;

  // Reactions:
  Tumor_Growth_1:  => T_1; compartment_*Function_for_Tumor_Growth_1(a, T_1, b);
  Tumor_Growth_2:  => T_2; compartment_*Function_for_Tumor_Growth_2(a, p, T_2, b);
  Tumor_Killing_T1_E1: T_1 => ; compartment_*Function_for_Tumor_Killing_T1_E1(mu, E_1_Innate, T_1);
  Tumor_Killing_T1_E2: T_1 => ; compartment_*Function_for_Tumor_Killing_T1_E2(beta, E_2_Adaptive, T_1);
  Tumor_Competition_1: T_1 => ; compartment_*Function_for_Tumor_Competition_1(nu, T_1, T_2);
  Tumor_Competition_2: T_2 => ; compartment_*Function_for_Tumor_Competition_2(r, nu, T_1, T_2);
  Tumor_Killing_T2_E1: T_2 => ; compartment_*Function_for_Tumor_Killing_T2_E1(q, E_1_Innate, T_2, mu);
  E1_Production_Constant:  => E_1_Innate; compartment_*Constant_flux__irreversible(c_1);
  E1_Death: E_1_Innate => ; compartment_*c_2*E_1_Innate;
  E1_Depletion: E_1_Innate => ; compartment_*Function_for_E1_Depletion(c_3, T_1, T_2, E_1_Innate);
  E1_Recruitment:  => E_1_Innate; compartment_*Function_for_E1_Recruitment(c_4, T_1, s, T_2, E_1_Innate, c_5);
  E2_Recruitment:  => E_2_Adaptive; compartment_*Function_for_E2_Recruitment(d_1, T_1, E_1_Innate);
  E2_Depletion: E_2_Adaptive => ; compartment_*Function_for_E2_Depletion(d_2, T_1, E_2_Adaptive);
  E2_Death: E_2_Adaptive => ; compartment_*d_3*E_2_Adaptive;

  // Species initializations:
  T_1 = 80000000;
  T_2 = 20000000;
  E_1_Innate = 10500000;
  E_2_Adaptive = 0;

  // Compartment initializations:
  compartment_ = 1;

  // Variable initializations:
  a = 0.514;
  b = 2e-09;
  mu = 1.101e-07;
  beta = 1.101e-10;
  nu = 1.101e-09;
  c_1 = 13000;
  c_2 = 0.0412;
  c_3 = 3.422e-10;
  c_4 = 0.1245;
  c_5 = 20193000;
  d_1 = 1.1e-07;
  d_2 = 3.42e-10;
  d_3 = 0.02;
  p = 0.35;
  q = 1;
  r = 1.5;
  s = 1;

  // Other declarations:
  var T_Total;
  const compartment_, a, b, mu, beta, nu, c_1, c_2, c_3, c_4, c_5, d_1, d_2;
  const d_3, p, q, r, s;

  // Unit definitions:
  unit volume = 1e-3 litre;
  unit substance = item;

  // Display Names:
  compartment_ is "compartment";

  // CV terms:
  compartment_ hypernym "http://identifiers.org/ncit/C94498"
  T_1 identity "http://identifiers.org/cl/CL:0001063"
  T_2 identity "http://identifiers.org/cl/CL:0001063"
  E_1_Innate hypernym "http://identifiers.org/cl/CL:0000623"
  E_1_Innate hypernym "http://identifiers.org/cl/CL:0001065"
  E_2_Adaptive hypernym "http://identifiers.org/cl/CL:0000084"
  Tumor_Growth_1 hypernym "http://identifiers.org/ncit/C18081"
  Tumor_Growth_2 hypernym "http://identifiers.org/ncit/C18081"
  Tumor_Killing_T1_E1 hypernym "http://identifiers.org/go/GO:0002420"
  Tumor_Killing_T1_E2 hypernym "http://identifiers.org/go/GO:0002419"
  Tumor_Competition_1 hypernym "http://identifiers.org/go/GO:0035212"
  Tumor_Competition_2 hypernym "http://identifiers.org/go/GO:0035212"
  Tumor_Killing_T2_E1 hypernym "http://identifiers.org/go/GO:0002420"
  E1_Production_Constant hypernym "http://identifiers.org/ncit/C18081"
  E1_Death hypernym "http://identifiers.org/go/GO:0008219"
  E1_Depletion hypernym "http://identifiers.org/go/GO:0008219"
  E1_Recruitment hypernym "http://identifiers.org/go/GO:0030101"
  E2_Recruitment hypernym "http://identifiers.org/go/GO:0072683"
  E2_Depletion hypernym "http://identifiers.org/go/GO:0008219"
  E2_Death hypernym "http://identifiers.org/go/GO:0008219"
end

Alvarez2019___A_nonlinear_mathematical_model_of_cell_mediated_immune_response_for_tumor_phenotypic_heterogeneity is "Alvarez2019 - A nonlinear mathematical model of cell-mediated immune response for tumor phenotypic heterogeneity"

Alvarez2019___A_nonlinear_mathematical_model_of_cell_mediated_immune_response_for_tumor_phenotypic_heterogeneity description "http://identifiers.org/pubmed/30930063"
Alvarez2019___A_nonlinear_mathematical_model_of_cell_mediated_immune_response_for_tumor_phenotypic_heterogeneity model_entity_is "http://identifiers.org/biomodels.db/MODEL1908120003",
                                                                                                                                 "http://identifiers.org/biomodels.db/BIOMD0000000790"
Alvarez2019___A_nonlinear_mathematical_model_of_cell_mediated_immune_response_for_tumor_phenotypic_heterogeneity property "http://identifiers.org/mamo/MAMO_0000046"
Alvarez2019___A_nonlinear_mathematical_model_of_cell_mediated_immune_response_for_tumor_phenotypic_heterogeneity property "http://identifiers.org/go/GO:0002418"
`

let newAnt2 = `
// Created by libAntimony v2.13.2
function function_17(substrate, Km, V)
  V*substrate/(Km + substrate);
end

function_17 is "Henri-Michaelis-Menten (irreversible)"

function function_12(substrate, product, Kms, Kmp, Vf, Vr)
  (Vf*substrate/Kms - Vr*product/Kmp)/(1 + substrate/Kms + product/Kmp);
end

function_12 is "Reversible Michaelis-Menten"

function function_15(Vmax_v7, GAP, KGAP_v7, NAD, KNAD_v7, r_v7, BPGA13, KBPGA13_v7, NADH, KNADH_v7)
  Vmax_v7*(((GAP/KGAP_v7)*(NAD/KNAD_v7) - r_v7*(BPGA13/KBPGA13_v7)*(NADH/KNADH_v7))/((1 + GAP/KGAP_v7 + BPGA13/KBPGA13_v7)*(1 + NAD/KNAD_v7 + NADH/KNADH_v7)));
end

function_15 is "Rate Law for glyceraldehyde3phosphatedehydrogenase"

function function_20(k, atpc, adpc)
  k*atpc/adpc;
end

function_20 is "Rate Law for atp utilisation"

function function_19(Vmax_v12, PEP, PK_n, ADPc, KADP_v12, ATPc)
  Vmax_v12*(PEP/(0.34*(1 + ATPc/0.57 + ADPc/0.64)))^PK_n*(ADPc/KADP_v12)/((1 + (PEP/(0.34*(1 + ATPc/0.57 + ADPc/0.64)))^PK_n)*(1 + ADPc/KADP_v12));
end

function_19 is "Rate Law for pyruvate kinase"

function function_16(Vmax_v8, DHAPg, KDHAPg_v8, NADH, KNADH_v8, r_v8, NAD, KNAD_v8, Gly3Pg, KGly3Pg_v8)
  Vmax_v8*(((DHAPg/KDHAPg_v8)*(NADH/KNADH_v8) - r_v8*(NAD/KNAD_v8)*(Gly3Pg/KGly3Pg_v8))/((1 + DHAPg/KDHAPg_v8 + Gly3Pg/KGly3Pg_v8)*(1 + NADH/KNADH_v8 + NAD/KNAD_v8)));
end

function_16 is "Rate Law for glycerol3phosphatedehydrogenase"

function function_18(Vmax_v11, BPGA13, KBPGA13_v11, ADPg, KADPg_v11, r_v11, PGA3, KPGA3_v11, ATPg, KATPg_v11)
  Vmax_v11*(((BPGA13/KBPGA13_v11)*(ADPg/KADPg_v11) - r_v11*(PGA3/KPGA3_v11)*(ATPg/KATPg_v11))/((1 + BPGA13/KBPGA13_v11 + PGA3/KPGA3_v11)*(1 + ADPg/KADPg_v11 + ATPg/KATPg_v11)));
end

function_18 is "Rate Law for phosphoglycerate kinase"

function function_13(Vmax_v4, Ki1Fru16BP_v4, Fru16BP, Fru6P, KFru6P_v4, ATPg, KATPg_v4, Ki2Fru16BP_v4)
  Vmax_v4*(Ki1Fru16BP_v4/(Ki1Fru16BP_v4 + Fru16BP))*(Fru6P/KFru6P_v4)*(ATPg/KATPg_v4)/((1 + Fru6P/KFru6P_v4 + Fru16BP/Ki2Fru16BP_v4)*(1 + ATPg/KATPg_v4));
end

function_13 is "Rate Law for phophofructokinase"

function function_21(Vmax_v14, Gly3Pg, KGly3Pg_v14, ADPg, KADPg_v14, r_v14, Glycerol, KGlycerol_v14, ATPg, KATPg_v14)
  Vmax_v14*(((Gly3Pg/KGly3Pg_v14)*(ADPg/KADPg_v14) - r_v14*(Glycerol/KGlycerol_v14)*(ATPg/KATPg_v14))/((1 + Gly3Pg/KGly3Pg_v14 + Glycerol/KGlycerol_v14)*(1 + ADPg/KADPg_v14 + ATPg/KATPg_v14)));
end

function_21 is "Rate Law for glycerol kinase"

function function_11(Vmax_v2, GlucoseInt, KGlcInt_v2, ATPg, KATPg_v2, ADPg, KADPg_v2, Glc6P, KGlc6P_v2)
  Vmax_v2*(GlucoseInt/KGlcInt_v2)*(ATPg/KATPg_v2)/((1 + ATPg/KATPg_v2 + ADPg/KADPg_v2)*(1 + GlucoseInt/KGlcInt_v2 + Glc6P/KGlc6P_v2));
end

function_11 is "Rate Law for hexokinase"

function function_14(Vmax_v5, Fru16BP, GAP, DHAPg, Keq_v5, ATPg, ADPg, AMPg, r_v5, KGAP_v5, KGAPi_v5)
  Vmax_v5*(Fru16BP - GAP*DHAPg/Keq_v5)/(0.009*(1 + ATPg/0.68 + ADPg/1.51 + AMPg/3.65) + Fru16BP + GAP*(0.015*(1 + ATPg/0.68 + ADPg/1.51 + AMPg/3.65)/Keq_v5)*(1/r_v5) + DHAPg*(KGAP_v5/Keq_v5)*(1/r_v5) + Fru16BP*GAP/KGAPi_v5 + (GAP*DHAPg/Keq_v5)*(1/r_v5));
end

function_14 is "Rate Law for aldolase"

function function_22(k, atp, amp, keqak, adp)
  k*(atp*amp - keqak*adp*adp);
end

function_22 is "Rate Law for adenylate kinase"

function function_10(Vmax_v1, GlucoseExt, GlucoseInt, KGlc, Alpha_v1)
  Vmax_v1*((GlucoseExt - GlucoseInt)/(KGlc + GlucoseExt + GlucoseInt + Alpha_v1*GlucoseExt*GlucoseInt/KGlc));
end

function_10 is "Rate Law for glucose transport"


model *Model_1()

  // Compartments and Species:
  compartment compartment_1, compartment_2, compartment_3;
  species species_1 in compartment_1, species_2 in compartment_1, species_3 in compartment_1;
  species species_4 in compartment_1, species_5 in compartment_1, species_6 in compartment_1;
  species species_7 in compartment_1, species_8 in compartment_1, species_9 in compartment_1;
  species species_10 in compartment_2, species_11 in compartment_2, species_12 in compartment_2;
  species species_13 in compartment_2, species_14 in compartment_2, species_15 in compartment_2;
  species species_16 in compartment_2, species_17 in compartment_2, species_18 in compartment_2;
  species species_19 in compartment_2, species_20 in compartment_2, species_21 in compartment_2;
  species species_22 in compartment_2, species_23 in compartment_2, species_24 in compartment_2;
  species $species_25 in compartment_3, $species_26 in compartment_3, $species_27 in compartment_3;

  // Reactions:
  vGT: $species_25 -> species_10; function_10(vGT_Vmax_v1, species_25, species_10, vGT_KGlc, vGT_Alpha_v1);
  vHK: species_10 + species_11 -> species_14 + species_12; RaHXK*compartment_2*function_11(vHK_Vmax_v2, species_10, vHK_KGlcInt_v2, species_11, vHK_KATPg_v2, species_12, vHK_KADPg_v2, species_14, vHK_KGlc6P_v2);
  vPGI: species_14 -> species_15; compartment_2*function_12(species_14, species_15, vPGI_Kms, vPGI_Kmp, vPGI_Vf, vPGI_Vr);
  vPFK: species_15 + species_11 -> species_16 + species_12; RaPFK*compartment_2*function_13(vPFK_Vmax_v4, vPFK_Ki1Fru16BP_v4, species_16, species_15, vPFK_KFru6P_v4, species_11, vPFK_KATPg_v4, vPFK_Ki2Fru16BP_v4);
  vALD: species_16 -> species_17 + species_18; compartment_2*function_14(vALD_Vmax_v5, species_16, species_18, species_17, vALD_Keq_v5, species_11, species_12, species_13, vALD_r_v5, vALD_KGAP_v5, vALD_KGAPi_v5);
  vTPI: species_17 -> species_18; compartment_2*function_12(species_17, species_18, vTPI_Kms, vTPI_Kmp, vTPI_Vf, vTPI_Vr);
  vGAPDH: species_18 + species_19 -> species_21 + species_20; compartment_2*function_15(vGAPDH_Vmax_v7, species_18, vGAPDH_KGAP_v7, species_19, vGAPDH_KNAD_v7, vGAPDH_r_v7, species_21, vGAPDH_KBPGA13_v7, species_20, vGAPDH_KNADH_v7);
  vGPDH: species_17 + species_20 -> species_19 + species_22; compartment_2*function_16(vGPDH_Vmax_v8, species_17, vGPDH_KDHAPg_v8, species_20, vGPDH_KNADH_v8, vGPDH_r_v8, species_19, vGPDH_KNAD_v8, species_22, vGPDH_KGly3Pg_v8);
  vGPO: species_9 => species_8; compartment_1*function_17(species_9, vGPO_Km, vGPO_V);
  vPT: species_1 => $species_26; function_17(species_1, vPT_Km, vPT_V);
  vPGK: species_21 + species_12 -> species_23 + species_11; compartment_2*function_18(vPGK_Vmax_v11, species_21, vPGK_KBPGA13_v11, species_12, vPGK_KADPg_v11, vPGK_r_v11, species_23, vPGK_KPGA3_v11, species_11, vPGK_KATPg_v11);
  vPK: species_4 + species_2 -> species_1 + species_3; RaPYK*compartment_1*function_19(vPK_Vmax_v12, species_4, vPK_PK_n, species_2, vPK_KADP_v12, species_3);
  vAU: species_3 => species_2; compartment_1*function_20(vAU_k, species_3, species_2);
  vGK: species_22 + species_12 -> species_24 + species_11; compartment_2*function_21(vGK_Vmax_v14, species_22, vGK_KGly3Pg_v14, species_12, vGK_KADPg_v14, vGK_r_v14, species_24, vGK_KGlycerol_v14, species_11, vGK_KATPg_v14);
  vPGM: species_7 -> species_5; RaPGAM*compartment_1*function_12(species_7, species_5, vPGM_Kms, vPGM_Kmp, vPGM_Vf, vPGM_Vr);
  vENO: species_5 -> species_4; RaENO*compartment_1*function_12(species_5, species_4, vENO_Kms, vENO_Kmp, vENO_Vf, vENO_Vr);
  vAKc: species_3 + species_6 -> 2 species_2; compartment_1*function_22(vAKc_k, species_3, species_6, vAKc_keqak, species_2);
  vAKg: species_11 + species_13 -> 2 species_12; compartment_2*function_22(vAKg_k, species_11, species_13, vAKg_keqak, species_12);
  vPGT: species_23 -> species_7; vPGT_k1*species_23 - vPGT_k2*species_7;
  vANTI: species_22 + species_8 -> species_9 + species_17; vANTI_k1*species_22*species_8 - vANTI_k2*species_9*species_17;
  vGlyT: species_24 -> $species_27; vGlyT_k1*species_24 - vGlyT_k2*species_27;

  // Species initializations:
  species_1 = 10;
  species_2 = 1.31652277625;
  species_3 = 0.341738611875;
  species_4 = 0;
  species_5 = 0;
  species_6 = 2.24173861188;
  species_7 = 0;
  species_8 = 2.23134594788;
  species_9 = 2.76865405212;
  species_10 = 0;
  species_11 = 0.240501857508;
  species_12 = 1.51899628498;
  species_13 = 4.24050185751;
  species_14 = 0.5;
  species_15 = 0.5;
  species_16 = 10;
  species_17 = 8.47911460193;
  species_18 = 2.5;
  species_19 = 2;
  species_20 = 2;
  species_21 = 0.5;
  species_22 = 10.5208853981;
  species_23 = 0;
  species_24 = 0;
  species_25 = 5;
  species_26 = 0;
  species_27 = 0;

  // Compartment initializations:
  compartment_1 = 1;
  compartment_2 = 1;
  compartment_3 = 1;

  // Variable initializations:
  RaHXK = 1;
  RaPFK = 1;
  RaPYK = 1;
  RaPGAM = 1;
  RaENO = 1;
  vGT_Vmax_v1 = 108.9;
  vGT_KGlc = 1;
  vGT_Alpha_v1 = 0.75;
  vHK_Vmax_v2 = 1929;
  vHK_KGlcInt_v2 = 0.1;
  vHK_KATPg_v2 = 0.116;
  vHK_KADPg_v2 = 0.126;
  vHK_KGlc6P_v2 = 12;
  vPGI_Kms = 0.4;
  vPGI_Kmp = 0.12;
  vPGI_Vf = 1305;
  vPGI_Vr = 1305;
  vPFK_Vmax_v4 = 1708;
  vPFK_Ki1Fru16BP_v4 = 15.8;
  vPFK_KFru6P_v4 = 0.82;
  vPFK_KATPg_v4 = 0.026;
  vPFK_Ki2Fru16BP_v4 = 10.7;
  vALD_Vmax_v5 = 560;
  vALD_Keq_v5 = 0.069;
  vALD_r_v5 = 1.19;
  vALD_KGAP_v5 = 0.067;
  vALD_KGAPi_v5 = 0.098;
  vTPI_Kms = 1.2;
  vTPI_Kmp = 0.25;
  vTPI_Vf = 999.3;
  vTPI_Vr = 5696.01;
  vGAPDH_Vmax_v7 = 720.9;
  vGAPDH_KGAP_v7 = 0.15;
  vGAPDH_KNAD_v7 = 0.45;
  vGAPDH_r_v7 = 0.67;
  vGAPDH_KBPGA13_v7 = 0.1;
  vGAPDH_KNADH_v7 = 0.02;
  vGPDH_Vmax_v8 = 465;
  vGPDH_KDHAPg_v8 = 0.1;
  vGPDH_KNADH_v8 = 0.01;
  vGPDH_r_v8 = 0.28;
  vGPDH_KNAD_v8 = 0.4;
  vGPDH_KGly3Pg_v8 = 2;
  vGPO_Km = 1.7;
  vGPO_V = 368;
  vPT_Km = 1.96;
  vPT_V = 200;
  vPGK_Vmax_v11 = 2862;
  vPGK_KBPGA13_v11 = 0.003;
  vPGK_KADPg_v11 = 0.1;
  vPGK_r_v11 = 0.47;
  vPGK_KPGA3_v11 = 1.62;
  vPGK_KATPg_v11 = 0.29;
  vPK_Vmax_v12 = 1020;
  vPK_PK_n = 2.5;
  vPK_KADP_v12 = 0.114;
  vAU_k = 50;
  vGK_Vmax_v14 = 200;
  vGK_KGly3Pg_v14 = 3.83;
  vGK_KADPg_v14 = 0.56;
  vGK_r_v14 = 60.86;
  vGK_KGlycerol_v14 = 0.44;
  vGK_KATPg_v14 = 0.24;
  vPGM_Kms = 0.27;
  vPGM_Kmp = 0.11;
  vPGM_Vf = 225;
  vPGM_Vr = 495;
  vENO_Kms = 0.054;
  vENO_Kmp = 0.24;
  vENO_Vf = 598;
  vENO_Vr = 394.68;
  vAKc_k = 1000000;
  vAKc_keqak = 0.442;
  vAKg_k = 1000000;
  vAKg_keqak = 0.442;
  vPGT_k1 = 1000000;
  vPGT_k2 = 1000000;
  vANTI_k1 = 1000000;
  vANTI_k2 = 1000000;
  vGlyT_k1 = 1000000;
  vGlyT_k2 = 1000000;

  // Other declarations:
  const compartment_1, compartment_2, compartment_3, RaHXK, RaPFK, RaPYK;
  const RaPGAM, RaENO;

  // Unit definitions:
  unit time_unit = second;
  unit substance = 1e-3 mole;
  unit volume = 1e-3 litre;

  // Display Names:
  compartment_1 is "cytosol";
  compartment_2 is "glycosome";
  compartment_3 is "extracellular";
  species_1 is "pyruvate";
  species_2 is "adpc";
  species_3 is "atpc";
  species_4 is "phosphoenolpyruvate";
  species_5 is "2phosphoglycerate";
  species_6 is "ampc";
  species_7 is "3phosphoglycerate cytosol";
  species_8 is "dihydroxyacetonephosphate cytosol";
  species_9 is "glycerol3phosphate cytosol";
  species_10 is "glucose";
  species_11 is "atpg";
  species_12 is "adpg";
  species_13 is "ampg";
  species_14 is "glucose6phosphate";
  species_15 is "fructose6phosphate";
  species_16 is "fructose16bisphosphate";
  species_17 is "dihydroxyacetonephosphate";
  species_18 is "glyceraldehyde3phosphate";
  species_19 is "nad";
  species_20 is "nadh";
  species_21 is "bisphosphoglycerate";
  species_22 is "glycerol3phosphate";
  species_23 is "3phosphoglycerate";
  species_24 is "glycerol";
  species_25 is "glucose external";
  species_26 is "pyruvate external";
  species_27 is "glycerol external";
  vGT is "glucose transport";
  vHK is "hexokinase";
  vPGI is "phosphoglycerate isomerase";
  vPFK is "phophofructokinase";
  vALD is "aldolase";
  vTPI is "triosephosphate isomerase";
  vGAPDH is "glyceraldehyde3phosphatedehydrogenase";
  vGPDH is "glycerol3phosphatedehydrogenase";
  vGPO is "glycerol3phosphate oxidase";
  vPT is "pyruvate transport";
  vPGK is "phosphoglycerate kinase";
  vPK is "pyruvate kinase";
  vAU is "atp utilisation";
  vGK is "glycerol kinase";
  vPGM is "phosphoglycerate mutase";
  vENO is "enolase";
  vAKc is "adenylate kinase cytosol";
  vAKg is "adenylate kinase glycosome";
  vPGT is "3phosphoglycerate transport";
  vANTI is "gly3p dhap antiporter";
  vGlyT is "glycerol transport";

  // CV terms:
  compartment_1 identity "http://identifiers.org/go/GO:0005829"
  compartment_2 identity "http://identifiers.org/go/GO:0020015"
  compartment_3 identity "http://identifiers.org/go/GO:0005576"
  species_1 hypernym "http://identifiers.org/chebi/CHEBI:32816",
                     "http://identifiers.org/kegg.compound/C00022",
                     "http://identifiers.org/pubchem.substance/3324",
                     "http://identifiers.org/3dmet/B00006",
                     "http://identifiers.org/cas/127-17-3"
  species_2 identity "http://identifiers.org/chebi/CHEBI:16761",
                     "http://identifiers.org/kegg.compound/C00008",
                     "http://identifiers.org/pubchem.substance/3310",
                     "http://identifiers.org/cas/20398-34-9"
  species_3 identity "http://identifiers.org/chebi/CHEBI:15422",
                     "http://identifiers.org/kegg.compound/C00002",
                     "http://identifiers.org/pubchem.substance/3304",
                     "http://identifiers.org/cas/56-65-5"
  species_4 identity "http://identifiers.org/kegg.compound/C00074",
                     "http://identifiers.org/pubchem.substance/3374",
                     "http://identifiers.org/3dmet/B00019",
                     "http://identifiers.org/cas/138-08-9",
                     "http://identifiers.org/chebi/CHEBI:18021"
  species_5 identity "http://identifiers.org/chebi/CHEBI:17835",
                     "http://identifiers.org/kegg.compound/C00631",
                     "http://identifiers.org/pubchem.substance/3904"
  species_6 identity "http://identifiers.org/chebi/CHEBI:16027",
                     "http://identifiers.org/kegg.compound/C00020",
                     "http://identifiers.org/pubchem.substance/3322",
                     "http://identifiers.org/cas/61-19-8"
  species_7 identity "http://identifiers.org/chebi/CHEBI:16108",
                     "http://identifiers.org/chebi/CHEBI:17794",
                     "http://identifiers.org/kegg.compound/C00197",
                     "http://identifiers.org/pubchem.substance/3497"
  species_8 identity "http://identifiers.org/chebi/CHEBI:16108",
                     "http://identifiers.org/kegg.compound/C00111",
                     "http://identifiers.org/pubchem.substance/3411",
                     "http://identifiers.org/3dmet/B00029"
  species_9 identity "http://identifiers.org/chebi/CHEBI:15978",
                     "http://identifiers.org/kegg.compound/C00093",
                     "http://identifiers.org/pubchem.substance/3393",
                     "http://identifiers.org/cas/57-03-4"
  species_10 identity "http://identifiers.org/chebi/CHEBI:4167",
                      "http://identifiers.org/kegg.compound/C00031",
                      "http://identifiers.org/pubchem.substance/3587"
  species_11 identity "http://identifiers.org/chebi/CHEBI:15422",
                      "http://identifiers.org/kegg.compound/C00002",
                      "http://identifiers.org/pubchem.substance/3304",
                      "http://identifiers.org/cas/56-65-5"
  species_12 identity "http://identifiers.org/chebi/CHEBI:16761",
                      "http://identifiers.org/kegg.compound/C00008",
                      "http://identifiers.org/pubchem.substance/3310",
                      "http://identifiers.org/cas/20398-34-9"
  species_13 identity "http://identifiers.org/chebi/CHEBI:16027",
                      "http://identifiers.org/kegg.compound/C00020",
                      "http://identifiers.org/pubchem.substance/3322",
                      "http://identifiers.org/cas/61-19-8"
  species_14 identity "http://identifiers.org/chebi/CHEBI:4170",
                      "http://identifiers.org/kegg.compound/C00668",
                      "http://identifiers.org/pubchem.substance/3937"
  species_15 identity "http://identifiers.org/chebi/CHEBI:16084",
                      "http://identifiers.org/kegg.compound/C05345",
                      "http://identifiers.org/pubchem.substance/7723"
  species_16 identity "http://identifiers.org/chebi/CHEBI:28013",
                      "http://identifiers.org/kegg.compound/C05378",
                      "http://identifiers.org/pubchem.substance/7752"
  species_17 identity "http://identifiers.org/chebi/CHEBI:16108",
                      "http://identifiers.org/kegg.compound/C00111",
                      "http://identifiers.org/pubchem.substance/3411",
                      "http://identifiers.org/3dmet/B00029"
  species_18 identity "http://identifiers.org/chebi/CHEBI:29052",
                      "http://identifiers.org/kegg.compound/C00118",
                      "http://identifiers.org/pubchem.substance/3418",
                      "http://identifiers.org/cas/591-57-1"
  species_19 identity "http://identifiers.org/chebi/CHEBI:15846",
                      "http://identifiers.org/kegg.compound/C00003",
                      "http://identifiers.org/pubchem.substance/3305",
                      "http://identifiers.org/cas/53-84-9"
  species_20 identity "http://identifiers.org/chebi/CHEBI:16908",
                      "http://identifiers.org/kegg.compound/C00004",
                      "http://identifiers.org/pubchem.substance/3306"
  species_21 identity "http://identifiers.org/chebi/CHEBI:16001",
                      "http://identifiers.org/kegg.compound/C00236",
                      "http://identifiers.org/pubchem.substance/3535",
                      "http://identifiers.org/cas/38168-82-0"
  species_22 identity "http://identifiers.org/chebi/CHEBI:15978",
                      "http://identifiers.org/kegg.compound/C00093",
                      "http://identifiers.org/pubchem.substance/3393",
                      "http://identifiers.org/cas/57-03-4"
  species_23 identity "http://identifiers.org/chebi/CHEBI:17794",
                      "http://identifiers.org/kegg.compound/C00197",
                      "http://identifiers.org/pubchem.substance/3497"
  species_24 identity "http://identifiers.org/chebi/CHEBI:17754",
                      "http://identifiers.org/kegg.compound/C00116",
                      "http://identifiers.org/pubchem.substance/3416",
                      "http://identifiers.org/3dmet/B00032",
                      "http://identifiers.org/cas/56-81-5"
  species_25 identity "http://identifiers.org/chebi/CHEBI:4167",
                      "http://identifiers.org/kegg.compound/C00031"
  species_26 hypernym "http://identifiers.org/chebi/CHEBI:32816",
                      "http://identifiers.org/kegg.compound/C00022",
                      "http://identifiers.org/pubchem.substance/3324",
                      "http://identifiers.org/3dmet/B00006",
                      "http://identifiers.org/cas/127-17-3"
  species_27 identity "http://identifiers.org/chebi/CHEBI:17754",
                      "http://identifiers.org/kegg.compound/C00116",
                      "http://identifiers.org/pubchem.substance/3416",
                      "http://identifiers.org/3dmet/B00032",
                      "http://identifiers.org/cas/56-81-5"
  vGT homolog "http://identifiers.org/reactome/REACT_2092"
  vGT hypernym "http://identifiers.org/go/GO:0046323"
  vHK homolog "http://identifiers.org/reactome/REACT_1318"
  vHK hypernym "http://identifiers.org/ec-code/2.7.1.2",
               "http://identifiers.org/go/GO:0004396"
  vHK identity "http://identifiers.org/kegg.reaction/R00299"
  vPGI homolog "http://identifiers.org/reactome/REACT_1164"
  vPGI hypernym "http://identifiers.org/ec-code/5.3.1.9",
                "http://identifiers.org/go/GO:0004347"
  vPGI identity "http://identifiers.org/kegg.reaction/R00771"
  vPFK homolog "http://identifiers.org/reactome/REACT_736"
  vPFK hypernym "http://identifiers.org/ec-code/2.7.1.11",
                "http://identifiers.org/go/GO:0003872"
  vPFK identity "http://identifiers.org/kegg.reaction/R00756"
  vALD homolog "http://identifiers.org/reactome/REACT_1602"
  vALD hypernym "http://identifiers.org/ec-code/4.1.2.13",
                "http://identifiers.org/go/GO:0004332"
  vALD identity "http://identifiers.org/kegg.reaction/R01070"
  vTPI homolog "http://identifiers.org/reactome/REACT_775"
  vTPI hypernym "http://identifiers.org/ec-code/5.3.1.1",
                "http://identifiers.org/go/GO:0004807"
  vTPI identity "http://identifiers.org/kegg.reaction/R01015"
  vGAPDH homolog "http://identifiers.org/reactome/REACT_1847"
  vGAPDH hypernym "http://identifiers.org/ec-code/1.2.1.12",
                  "http://identifiers.org/go/GO:0043878"
  vGAPDH identity "http://identifiers.org/kegg.reaction/R01061"
  vGPDH homolog "http://identifiers.org/reactome/REACT_1146"
  vGPDH hypernym "http://identifiers.org/ec-code/3.1.3.21",
                 "http://identifiers.org/go/GO:0004367"
  vGPDH identity "http://identifiers.org/kegg.reaction/R00841"
  vGPO hypernym "http://identifiers.org/ec-code/1.1.3.21",
                "http://identifiers.org/go/GO:0004369"
  vGPO identity "http://identifiers.org/kegg.reaction/R00846"
  vPT hypernym "http://identifiers.org/go/GO:0050833",
               "http://identifiers.org/go/GO:0006849"
  vPGK homolog "http://identifiers.org/reactome/REACT_1186"
  vPGK hypernym "http://identifiers.org/ec-code/2.7.2.3",
                "http://identifiers.org/go/GO:0004618"
  vPGK identity "http://identifiers.org/kegg.reaction/R01512"
  vPK homolog "http://identifiers.org/reactome/REACT_1911"
  vPK hypernym "http://identifiers.org/ec-code/2.7.1.40",
               "http://identifiers.org/go/GO:0004743"
  vPK identity "http://identifiers.org/kegg.reaction/R00200"
  vAU hypernym "http://identifiers.org/go/GO:0006200"
  vGK hypernym "http://identifiers.org/ec-code/2.7.1.30",
               "http://identifiers.org/go/GO:0004370"
  vGK identity "http://identifiers.org/kegg.reaction/R00847"
  vGK homolog "http://identifiers.org/reactome/REACT_724"
  vPGM identity "http://identifiers.org/kegg.reaction/R01518"
  vPGM hypernym "http://identifiers.org/ec-code/5.4.2.1",
                "http://identifiers.org/go/GO:0004619"
  vPGM homolog "http://identifiers.org/reactome/REACT_576"
  vENO identity "http://identifiers.org/kegg.reaction/R00658"
  vENO hypernym "http://identifiers.org/ec-code/4.2.1.11",
                "http://identifiers.org/go/GO:0004634"
  vENO homolog "http://identifiers.org/reactome/REACT_1400"
  vAKc identity "http://identifiers.org/kegg.reaction/R00127"
  vAKc hypernym "http://identifiers.org/ec-code/2.7.4.3",
                "http://identifiers.org/go/GO:0004017"
  vAKc homolog "http://identifiers.org/reactome/REACT_643"
  vAKg identity "http://identifiers.org/kegg.reaction/R00127"
  vAKg hypernym "http://identifiers.org/ec-code/2.7.4.3",
                "http://identifiers.org/go/GO:0004017"
  vAKg homolog "http://identifiers.org/reactome/REACT_643"
  vPGT hypernym "http://identifiers.org/go/GO:0015120"
  vANTI hypernym "http://identifiers.org/go/GO:0015169"
  vGlyT hypernym "http://identifiers.org/go/GO:0015793"
end

Model_1 is "Albert2005_Glycolysis"

Model_1 model_entity_is "http://identifiers.org/biomodels.db/MODEL1511155915"
Model_1 model_entity_is "http://identifiers.org/biomodels.db/BIOMD0000000211"
Model_1 description "http://identifiers.org/pubmed/15955817"
Model_1 origin "http://identifiers.org/biomodels.db/MODEL1101100000",
               "http://identifiers.org/biomodels.db/BIOMD0000000071",
               "http://identifiers.org/pubmed/10329645"
Model_1 taxon "http://identifiers.org/taxonomy/5691"
Model_1 homolog "http://identifiers.org/reactome/REACT_1383"
Model_1 hypernym "http://identifiers.org/go/GO:0006096"
Model_1 identity "http://identifiers.org/kegg.pathway/tbr00010"
`

const AntimonyEditor = ({emitter}: Props) => {
  const editorRef = useRef<HTMLDivElement | null>(null);

  const [getCurrentModel, setCurrentModel] = useState<Uri>();

  let editor: any;

  const monacoRef = useRef<Monaco>();

  const doSave = () => {
    if (!!getCurrentModel) {
        if (!!monacoRef.current) {
            if (!!monacoRef.current.editor) {
                const model = monacoRef.current.editor.getModel(getCurrentModel)
                if (!!model) {
                    const args: SaveFileArgs = {
                        filepath: getCurrentModel.path,
                        data: model.getValue(),
                    }
                    emitter.emit("DO_SAVE_FILE", args)
                    console.log("done")
                }
            }
        }
    }
}

  useEffect(() => {
    if (editorRef.current) {
      // Load the custom language
      monaco.languages.register({ id: 'antimony' });
      monaco.languages.setMonarchTokensProvider('antimony', antimonyLanguage);

      // Load the custom theme
      monaco.editor.defineTheme('antimonyTheme', antimonyTheme);
      monaco.editor.setTheme('antimonyTheme');

      // Create the Monaco Editor instance
      editor = monaco.editor.create(editorRef.current, {
        bracketPairColorization: { enabled: true }, // Enable bracket pair colorization
        value: newAnt2,
        language: 'antimony', // Use your custom language
      });

      // Set language configuration for bracket pair colorization
      monaco.languages.setLanguageConfiguration('antimony', {
        brackets: [
          ['{', '}'],
          ['[', ']'],
          ['(', ')'],
          // Add any other bracket pairs used in your language, including nested ones
        ],
      });

      let parsedModel = parseAntimonyModel(editor.getValue());

      // Register the hover provider
      monaco.languages.registerHoverProvider('antimony', {
        provideHover: (model, position) => {
          const word = model.getWordAtPosition(position);
          let hoverContents: monaco.IMarkdownString[] = [];
      
          if (word) {
            if (parsedModel.reactions.has(word.word)) {
              hoverContents.push({ value: '**(reaction)**' });
            }
            if (parsedModel.species.has(word.word)) {
              const speciesInfo = parsedModel.species.get(word.word);
              hoverContents.push(
                { value: `**(species)** ${speciesInfo?.name}`},
                { value: `In compartment: ${speciesInfo?.compartment}` }
              );
            }
            if (parsedModel.initializations.has(word.word)) {
              const initializationInfo = parsedModel.initializations.get(word.word);
              hoverContents.push({ value: `Initialized Value: ${initializationInfo?.value}` });
            }
            if (parsedModel.displays.has(word.word)){
              const displayName = parsedModel.displays.get(word.word);
              console.log(`${displayName?.name}`)
              hoverContents.push({ value: `"${displayName?.name}"`})
            }
            return {
              range: new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn),
              contents: hoverContents,
            };
          }
      
          return null;
        },
      });

      // Cleanup
      return () => editor.dispose();
    }
  }, []);

  function save(editorUri: monaco.Uri) {
    monaco.editor.getModel(editorUri);
  }

  // console.log(parseAntimonyModel(newAnt));

  return (
    <div>
      {(getCurrentModel) &&
      <>
        <style>
          {`
            .smallbutton {
                background-color: #444857;
                border-radius: 2px;
                border-style: dotted;
                border-width: 1px;
                color: #cccccc;
                cursor: pointer;
                display: inline-block;
                font-size: 1em;
                font-weight: normal !important;
                line-height: 1.2;
                margin: 0 3px 0 0;
                padding: 2px 7px;
                position: relative;
                text-align: center;
                text-decoration: none !important;
                text-overflow: ellipsis;
                text-shadow: none;
                white-space: nowrap;
                }
            .smallbutton:hover {
                background-color: #5c5e73;
                color: white;
                }
          `}
        </style>
        <div>
          <Tabs/>
        </div>
        {!!getCurrentModel &&
          <div style={{
              "backgroundColor": "#343539",
              "padding": "4px",
              "paddingLeft": "10px",
              "color": "white",
          }}>
            <button
                style={{
                    "lineHeight": 1,
                }}
                onClick={doSave}
                className="btn btn-success">Save
            </button>
            &nbsp;&nbsp;&nbsp;
            {getCurrentModel.path}
          </div>
          }
      </>
      }
      <div id="ant-edit" ref={editorRef} style={{ height: '80vh' }}/>
    </div>
  );
};

export default AntimonyEditor;
