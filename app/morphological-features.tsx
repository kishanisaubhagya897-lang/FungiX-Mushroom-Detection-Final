import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";

import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Language = "en" | "ta" | "si";

type FeatureOption = {
  value: string;
  en: string;
  ta: string;
  si: string;
  description?: string;
};

type Feature = {
  key:
    | "capShape"
    | "capColor"
    | "capSurfaceTexture"
    | "undersideType"
    | "ringPresence"
    | "volvaPresence"
    | "gillColor"
    | "stalkShape";
  title: {
    en: string;
    ta: string;
    si: string;
  };
  subtitle: {
    en: string;
    ta: string;
    si: string;
  };
  options: FeatureOption[];
};

const FEATURES: Feature[] = [
  {
    key: "capShape",
    title: {
      en: "Cap Shape",
      ta: "தொப்பி வடிவம்",
      si: "තොප්පි හැඩය",
    },
    subtitle: {
      en: "Identify the overall shape of the mushroom cap.",
      ta: "காளானின் தொப்பியின் ஒட்டுமொத்த வடிவத்தைத் தேர்ந்தெடுக்கவும்.",
      si: "බිම්මල් තොප්පියේ සමස්ත හැඩය හඳුනා ගන්න.",
    },
    options: [
      {
        value: "convex",
        en: "Convex",
        ta: "வளைந்த குவிமாடம்",
        si: "උත්තල / ගෝලාකාර",
        description: "Rounded dome",
      },
      {
        value: "flat",
        en: "Flat",
        ta: "தட்டையான",
        si: "සමතලා",
        description: "Plane surface",
      },
      {
        value: "conical",
        en: "Conical",
        ta: "கூம்பு வடிவம்",
        si: "කේතු හැඩය",
        description: "Pointed",
      },
      {
        value: "funnel",
        en: "Funnel-shaped",
        ta: "புனல் வடிவம்",
        si: "පුනීල හැඩය",
        description: "Funnel-like",
      },
      {
        value: "irregular",
        en: "Irregular / lobed",
        ta: "ஒழுங்கற்ற / மடல் வடிவம்",
        si: "අක්‍රමවත් / කොටස් සහිත",
        description: "Uneven or lobed",
      },
    ],
  },

  {
    key: "capColor",
    title: {
      en: "Cap Color",
      ta: "தொப்பியின் நிறம்",
      si: "තොප්පියේ වර්ණය",
    },
    subtitle: {
      en: "Select the dominant visible color of the cap.",
      ta: "தொப்பியில் தென்படும் முக்கிய நிறத்தைத் தேர்ந்தெடுக்கவும்.",
      si: "තොප්පියේ ප්‍රධාන පෙනෙන වර්ණය තෝරන්න.",
    },
    options: [
      {
        value: "orange-red",
        en: "Orange / Red",
        ta: "செம்மஞ்சள் / சிவப்பு",
        si: "තැඹිලි / රතු",
        description: "Orange-red",
      },
      {
        value: "yellow",
        en: "Yellow / Pale Yellow",
        ta: "மஞ்சள் / வெளிர் மஞ்சள்",
        si: "කහ / ලා කහ",
        description: "Pale yellow",
      },
      {
        value: "brown",
        en: "Brown",
        ta: "பழுப்பு",
        si: "දුඹුරු",
        description: "Brown / reddish-brown",
      },
      {
        value: "white",
        en: "White / Cream",
        ta: "வெள்ளை / கிரீம்",
        si: "සුදු / ක්‍රීම්",
        description: "White, cream or pale grey",
      },
      {
        value: "purple-green",
        en: "Purple / Violet / Green",
        ta: "ஊதா / வயலெட் / பச்சை",
        si: "දම් / වයලට් / කොළ",
        description: "Mixed unusual colors",
      },
      {
        value: "pink",
        en: "Pink",
        ta: "இளஞ்சிவப்பு",
        si: "රෝස",
        description: "Pink",
      },
    ],
  },

  {
    key: "capSurfaceTexture",
    title: {
      en: "Cap Surface Texture",
      ta: "தொப்பியின் மேற்பரப்பு அமைப்பு",
      si: "තොප්පි මතුපිටේ වයනය",
    },
    subtitle: {
      en: "Observe the texture and surface characteristics.",
      ta: "தொப்பியின் மேற்பரப்பின் தன்மையை கவனித்து தேர்ந்தெடுக்கவும்.",
      si: "තොප්පියේ මතුපිටේ ස්වභාවය නිරීක්ෂණය කර තෝරන්න.",
    },
    options: [
      {
        value: "smooth-dry",
        en: "Smooth / Dry",
        ta: "மென்மையான / உலர்ந்த",
        si: "සුමට / වියළි",
      },
      {
        value: "warty-scaly",
        en: "Warty / Scaly",
        ta: "மரு / செதில் போன்ற",
        si: "ගැටිති සහිත / කොරපොතු සහිත",
      },
      {
        value: "slimy",
        en: "Slimy / Sticky",
        ta: "பிசுபிசுப்பான / ஒட்டும்",
        si: "ලිස්සන / ඇලෙන සුළු",
      },
      {
        value: "velvety",
        en: "Velvety / Fibrous",
        ta: "வெல்வெட் போன்ற / நார்ச்சத்து",
        si: "වෙල්වට් වැනි / තන්තුමය",
      },
      {
        value: "honeycomb",
        en: "Honeycomb / Pitted",
        ta: "தேன்கூடு / குழிவான",
        si: "මී වදය වැනි / කුහර සහිත",
        description: "Honeycomb, pitted or brain-like",
      },
    ],
  },

  {
    key: "undersideType",
    title: {
      en: "Gill / Underside Type",
      ta: "கில் / அடிப்பகுதி வகை",
      si: "ගිල් / යටි පැත්තේ වර්ගය",
    },
    subtitle: {
      en: "Identify the structure visible underneath the cap.",
      ta: "தொப்பியின் கீழ்பகுதியில் காணப்படும் அமைப்பைத் தேர்ந்தெடுக்கவும்.",
      si: "තොප්පිය යටින් පෙනෙන ව්‍යුහය හඳුනා ගන්න.",
    },
    options: [
      {
        value: "gills",
        en: "Gills",
        ta: "கில்கள்",
        si: "ගිල්",
        description: "Blade-like",
      },
      {
        value: "pores",
        en: "Pores",
        ta: "துளைகள்",
        si: "සිදුරු",
        description: "Sponge-like",
      },
      {
        value: "spines",
        en: "Spines / Teeth",
        ta: "முள் / பற்கள்",
        si: "කටු / දත් වැනි",
      },
      {
        value: "honeycomb-pits",
        en: "Honeycomb Pits",
        ta: "தேன்கூடு குழிகள்",
        si: "මී වද වැනි කුහර",
      },
      {
        value: "no-gills",
        en: "No Gills",
        ta: "கில்கள் இல்லை",
        si: "ගිල් නොමැත",
        description: "Folds / gleba",
      },
    ],
  },

  {
    key: "ringPresence",
    title: {
      en: "Ring (Annulus) Presence",
      ta: "வளையம் (Annulus) இருப்பு",
      si: "මුදු (Annulus) පැවතීම",
    },
    subtitle: {
      en: "Check whether a ring structure is present on the stalk.",
      ta: "தண்டில் வளைய அமைப்பு உள்ளதா என்பதைத் தேர்ந்தெடுக்கவும்.",
      si: "දණ්ඩේ මුදු ව්‍යුහයක් තිබේදැයි හඳුනා ගන්න.",
    },
    options: [
      {
        value: "yes",
        en: "Yes - Ring Present",
        ta: "ஆம் - வளையம் உள்ளது",
        si: "ඔව් - මුදුව ඇත",
      },
      {
        value: "no",
        en: "No - No Ring",
        ta: "இல்லை - வளையம் இல்லை",
        si: "නැත - මුදුවක් නැත",
      },
      {
        value: "partial",
        en: "Partial / Skirt-like",
        ta: "பகுதி / பாவாடை போன்ற",
        si: "අර්ධ / සායක් වැනි",
      },
      {
        value: "ring-zone",
        en: "Ring Zone Only",
        ta: "வளையப் பகுதி மட்டும்",
        si: "මුදු කලාපය පමණි",
        description: "No complete ring",
      },
      {
        value: "not-visible",
        en: "Not Visible / Broken",
        ta: "தெரியவில்லை / உடைந்தது",
        si: "නොපෙනේ / කැඩී ඇත",
      },
    ],
  },

  {
    key: "volvaPresence",
    title: {
      en: "Volva (Base Cup) Presence",
      ta: "வால்வா (அடிப்பகுதி கிண்ணம்) இருப்பு",
      si: "Volva (පාදක කෝප්පය) පැවතීම",
    },
    subtitle: {
      en: "Observe the base of the mushroom for a cup or swollen structure.",
      ta: "காளானின் அடிப்பகுதியில் கிண்ணம் அல்லது வீங்கிய அமைப்பு உள்ளதா என்பதைப் பார்க்கவும்.",
      si: "බිම්මලේ පාදයේ කෝප්පයක් හෝ ඉදිමුණු ව්‍යුහයක් තිබේදැයි බලන්න.",
    },
    options: [
      {
        value: "cup",
        en: "Yes - Cup / Sack",
        ta: "ஆம் - கிண்ணம் / பை",
        si: "ඔව් - කෝප්පයක් / බෑගයක්",
        description: "At the base",
      },
      {
        value: "clean",
        en: "No - Clean Base",
        ta: "இல்லை - சுத்தமான அடிப்பகுதி",
        si: "නැත - පිරිසිදු පාදය",
      },
      {
        value: "basal-bulb",
        en: "Basal Bulb",
        ta: "அடிப்பகுதி வீக்கம்",
        si: "පාදක බල්බය",
        description: "Swollen base",
      },
      {
        value: "concentric-rings",
        en: "Concentric Rings",
        ta: "மைய வளையங்கள்",
        si: "සංකේන්ද්‍රික මුදු",
        description: "At the base",
      },
      {
        value: "not-visible",
        en: "Not Visible / Underground",
        ta: "தெரியவில்லை / நிலத்தடியில்",
        si: "නොපෙනේ / භූගත",
      },
    ],
  },

  {
    key: "gillColor",
    title: {
      en: "Gill Color",
      ta: "கில்களின் நிறம்",
      si: "ගිල් වල වර්ණය",
    },
    subtitle: {
      en: "Select the visible color of the gills or underside.",
      ta: "கில்கள் அல்லது அடிப்பகுதியில் காணப்படும் நிறத்தைத் தேர்ந்தெடுக்கவும்.",
      si: "ගිල් හෝ යටි පැත්තේ පෙනෙන වර්ණය තෝරන්න.",
    },
    options: [
      {
        value: "white-cream",
        en: "White / Cream",
        ta: "வெள்ளை / கிரீம்",
        si: "සුදු / ක්‍රීම්",
        description: "White, cream or pale",
      },
      {
        value: "pink-red",
        en: "Pink / Red / Salmon",
        ta: "இளஞ்சிவப்பு / சிவப்பு / சால்மன்",
        si: "රෝස / රතු / සැමන්",
      },
      {
        value: "brown",
        en: "Brown / Reddish-Brown",
        ta: "பழுப்பு / சிவப்பு-பழுப்பு",
        si: "දුඹුරු / රතු-දුඹුරු",
      },
      {
        value: "black-grey",
        en: "Black / Grey",
        ta: "கருப்பு / சாம்பல்",
        si: "කළු / අළු",
        description: "Blackish-brown or mottled",
      },
      {
        value: "yellow-orange",
        en: "Yellow / Orange / Buff",
        ta: "மஞ்சள் / செம்மஞ்சள் / வெளிர் பழுப்பு",
        si: "කහ / තැඹිලි / ලා දුඹුරු",
      },
      {
        value: "purple-green",
        en: "Purple / Green / Unusual",
        ta: "ஊதா / பச்சை / அசாதாரண நிறம்",
        si: "දම් / කොළ / අසාමාන්‍ය",
      },
      {
        value: "not-applicable",
        en: "Not Applicable",
        ta: "பொருந்தாது",
        si: "අදාළ නොවේ",
        description: "Pored / no gills",
      },
    ],
  },

  {
    key: "stalkShape",
    title: {
      en: "Stalk Shape",
      ta: "தண்டின் வடிவம்",
      si: "දණ්ඩේ හැඩය",
    },
    subtitle: {
      en: "Identify the shape and structure of the mushroom stalk.",
      ta: "காளானின் தண்டின் வடிவத்தையும் அமைப்பையும் தேர்ந்தெடுக்கவும்.",
      si: "බිම්මල් දණ්ඩේ හැඩය සහ ව්‍යුහය හඳුනා ගන්න.",
    },
    options: [
      {
        value: "club-shaped",
        en: "Enlarging Toward Base",
        ta: "அடிப்பகுதியை நோக்கி பெரிதாகும்",
        si: "පාදය දෙසට විශාල වන",
        description: "Club-shaped",
      },
      {
        value: "tapering",
        en: "Tapering Toward Base",
        ta: "அடிப்பகுதியை நோக்கி குறுகும்",
        si: "පාදය දෙසට සිහින් වන",
      },
      {
        value: "cylindrical",
        en: "Equal / Cylindrical",
        ta: "சமமான / உருளை வடிவம்",
        si: "සමාන / සිලින්ඩරාකාර",
        description: "Same width throughout",
      },
      {
        value: "absent",
        en: "Absent / No True Stalk",
        ta: "இல்லை / உண்மையான தண்டு இல்லை",
        si: "නැත / සැබෑ දණ්ඩක් නැත",
      },
    ],
  },
];

export default function MorphologicalFeaturesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const image =
    typeof params.image === "string" ? params.image : params.image?.[0];

  const [language, setLanguage] = useState<Language>("en");

  const [selectedFeatures, setSelectedFeatures] = useState<
    Record<string, string>
  >({});

  const completedCount = FEATURES.filter(
    (feature) => selectedFeatures[feature.key],
  ).length;

  const progressPercentage = (completedCount / FEATURES.length) * 100;

  const languageNames = {
    en: "English",
    ta: "தமிழ்",
    si: "සිංහල",
  };

  const getLanguageText = (text: {
    en: string;
    ta: string;
    si: string;
  }) => {
    return text[language];
  };

  const selectFeature = (featureKey: string, value: string) => {
    setSelectedFeatures((previous) => ({
      ...previous,
      [featureKey]: value,
    }));
  };

  const handleContinue = () => {
    if (completedCount !== FEATURES.length) {
      Alert.alert(
        "Incomplete Information",
        "Please select an option for all 8 morphological features.",
      );
      return;
    }

    /*
     * DEMO DATA STRUCTURE
     *
     * This structure is intentionally prepared for the
     * NEW XGBoost model.
     *
     * No old XGBoost model or old mapping is used here.
     */
    const featureData = {
      capShape: selectedFeatures.capShape,
      capColor: selectedFeatures.capColor,
      capSurfaceTexture: selectedFeatures.capSurfaceTexture,
      undersideType: selectedFeatures.undersideType,
      ringPresence: selectedFeatures.ringPresence,
      volvaPresence: selectedFeatures.volvaPresence,
      gillColor: selectedFeatures.gillColor,
      stalkShape: selectedFeatures.stalkShape,
    };

    console.log("NEW MORPHOLOGICAL FEATURE DATA:");
    console.log(JSON.stringify(featureData, null, 2));

    /*
     * The new XGBoost model is still being prepared.
     * Therefore this page currently passes the collected
     * features to the next demo stage.
     *
     * The old XGBoost API is NOT called here.
     */
    router.push({
      pathname: "/scanning",
      params: {
        image: image || "",
        featureData: JSON.stringify(featureData),
        mode: "morphological-demo",
      },
    });
  };

  const selectedLanguage = useMemo(
    () => languageNames[language],
    [language],
  );

  return (
    <LinearGradient
      colors={["#061A14", "#0B2E22", "#123F31"]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={23} color="#F1FAEE" />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <Text style={styles.logo}>FungiX</Text>
            <Text style={styles.logoSub}>MORPHOLOGY</Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        {/* INTRO */}
        <View style={styles.introSection}>
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>8 MORPHOLOGICAL FEATURES</Text>
          </View>

          <Text style={styles.title}>
            {language === "en"
              ? "Mushroom Features"
              : language === "ta"
                ? "காளான் பண்புகள்"
                : "බිම්මල් ලක්ෂණ"}
          </Text>

          <Text style={styles.subtitle}>
            {language === "en"
              ? "Select the visible characteristics of the mushroom to prepare the morphological analysis."
              : language === "ta"
                ? "மார்பாலஜிக்கல் பகுப்பாய்விற்காக காளானில் காணப்படும் பண்புகளைத் தேர்ந்தெடுக்கவும்."
                : "රූප විද්‍යාත්මක විශ්ලේෂණය සඳහා බිම්මලේ පෙනෙන ලක්ෂණ තෝරන්න."}
          </Text>
        </View>

        {/* LANGUAGE SELECTOR */}
        <View style={styles.languageCard}>
          <View style={styles.languageHeader}>
            <View>
              <Text style={styles.languageTitle}>
                Language / மொழி / භාෂාව
              </Text>

              <Text style={styles.languageSubtitle}>
                {selectedLanguage}
              </Text>
            </View>

            <Ionicons
              name="language-outline"
              size={24}
              color="#74C69D"
            />
          </View>

          <View style={styles.languageOptions}>
            {(["en", "ta", "si"] as Language[]).map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.languageButton,
                  language === item && styles.languageButtonSelected,
                ]}
                onPress={() => setLanguage(item)}
              >
                <Text
                  style={[
                    styles.languageButtonText,
                    language === item &&
                      styles.languageButtonTextSelected,
                  ]}
                >
                  {languageNames[item]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* IMAGE PREVIEW */}
        <View style={styles.imageCard}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons
                name="image-outline"
                size={42}
                color="#74C69D"
              />
              <Text style={styles.placeholderText}>
                Mushroom Image
              </Text>
            </View>
          )}

          <View style={styles.imageFooter}>
            <View>
              <Text style={styles.imageLabel}>
                {language === "en"
                  ? "Selected Mushroom"
                  : language === "ta"
                    ? "தேர்ந்தெடுக்கப்பட்ட காளான்"
                    : "තෝරාගත් බිම්මල"}
              </Text>

              <Text style={styles.imageSubLabel}>
                Morphological observation
              </Text>
            </View>

            <View style={styles.imageStatus}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="#74C69D"
              />
            </View>
          </View>
        </View>

        {/* FEATURE LIST */}
        {FEATURES.map((feature, index) => {
          const selectedValue = selectedFeatures[feature.key];

          return (
            <View key={feature.key} style={styles.featureCard}>
              {/* FEATURE HEADER */}
              <View style={styles.featureHeader}>
                <View style={styles.featureNumber}>
                  <Text style={styles.featureNumberText}>
                    {String(index + 1).padStart(2, "0")}
                  </Text>
                </View>

                <View style={styles.featureTitleContainer}>
                  <Text style={styles.featureTitle}>
                    {getLanguageText(feature.title)}
                  </Text>

                  <Text style={styles.featureEnglishTitle}>
                    {feature.title.en}
                  </Text>
                </View>

                {selectedValue ? (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color="#74C69D"
                  />
                ) : (
                  <Ionicons
                    name="ellipse-outline"
                    size={23}
                    color="#527568"
                  />
                )}
              </View>

              {/* THREE-LANGUAGE IDENTIFICATION */}
              <View style={styles.translationBox}>
                <Text style={styles.translationEnglish}>
                  EN: {feature.title.en}
                </Text>

                <Text style={styles.translationTamil}>
                  TA: {feature.title.ta}
                </Text>

                <Text style={styles.translationSinhala}>
                  SI: {feature.title.si}
                </Text>
              </View>

              <Text style={styles.featureSubtitle}>
                {getLanguageText(feature.subtitle)}
              </Text>

              {/* OPTIONS */}
              <View style={styles.optionGrid}>
                {feature.options.map((option) => {
                  const isSelected = selectedValue === option.value;

                  return (
                    <TouchableOpacity
                      key={option.value}
                      activeOpacity={0.8}
                      style={[
                        styles.optionCard,
                        isSelected && styles.optionCardSelected,
                      ]}
                      onPress={() =>
                        selectFeature(feature.key, option.value)
                      }
                    >
                      <View
                        style={[
                          styles.optionIndicator,
                          isSelected &&
                            styles.optionIndicatorSelected,
                        ]}
                      >
                        {isSelected && (
                          <Ionicons
                            name="checkmark"
                            size={14}
                            color="#081C15"
                          />
                        )}
                      </View>

                      <View style={styles.optionContent}>
                        <Text
                          style={[
                            styles.optionEnglish,
                            isSelected &&
                              styles.optionEnglishSelected,
                          ]}
                        >
                          {option.en}
                        </Text>

                        <Text
                          style={[
                            styles.optionTamil,
                            isSelected &&
                              styles.optionSecondarySelected,
                          ]}
                        >
                          {option.ta}
                        </Text>

                        <Text
                          style={[
                            styles.optionSinhala,
                            isSelected &&
                              styles.optionSecondarySelected,
                          ]}
                        >
                          {option.si}
                        </Text>

                        {option.description && (
                          <Text
                            style={[
                              styles.optionDescription,
                              isSelected &&
                                styles.optionDescriptionSelected,
                            ]}
                          >
                            {option.description}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}

        {/* PROGRESS */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressTitle}>
                {language === "en"
                  ? "Morphological Progress"
                  : language === "ta"
                    ? "மார்பாலஜிக்கல் முன்னேற்றம்"
                    : "රූප විද්‍යාත්මක ප්‍රගතිය"}
              </Text>

              <Text style={styles.progressSubtitle}>
                {completedCount} of {FEATURES.length} features completed
              </Text>
            </View>

            <Text style={styles.progressPercentage}>
              {Math.round(progressPercentage)}%
            </Text>
          </View>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progressPercentage}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* DEMO NOTICE */}
        <View style={styles.demoNotice}>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color="#74C69D"
          />

          <View style={styles.demoContent}>
            <Text style={styles.demoTitle}>
              Morphological Model — Demo Mode
            </Text>

            <Text style={styles.demoText}>
              The new XGBoost model is currently being prepared.
              Your selected features will be passed to the next
              analysis stage without using the previous model.
            </Text>
          </View>
        </View>

        {/* CONTINUE */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleContinue}
          style={styles.continueWrapper}
        >
          <LinearGradient
            colors={["#52B788", "#95D5B2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueButton}
          >
            <View>
              <Text style={styles.continueTitle}>
                {language === "en"
                  ? "Continue Analysis"
                  : language === "ta"
                    ? "பகுப்பாய்வைத் தொடரவும்"
                    : "විශ්ලේෂණය ඉදිරියට ගෙන යන්න"}
              </Text>

              <Text style={styles.continueSubtitle}>
                {completedCount}/{FEATURES.length} features selected
              </Text>
            </View>

            <Ionicons
              name="arrow-forward"
              size={25}
              color="#081C15"
            />
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 45 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 20,
  },

  header: {
    marginTop: 55,
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#123D31",
    borderWidth: 1,
    borderColor: "#245A47",
    alignItems: "center",
    justifyContent: "center",
  },

  logoContainer: {
    alignItems: "center",
  },

  logo: {
    color: "#F1FAEE",
    fontSize: 27,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  logoSub: {
    color: "#74C69D",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 2,
    marginTop: 2,
  },

  headerSpacer: {
    width: 44,
  },

  introSection: {
    paddingHorizontal: 20,
    marginTop: 28,
  },

  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#123D31",
    borderWidth: 1,
    borderColor: "#2D6A4F",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 30,
  },

  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#74C69D",
    marginRight: 7,
  },

  badgeText: {
    color: "#74C69D",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },

  title: {
    color: "#F1FAEE",
    fontSize: 30,
    fontWeight: "800",
    marginTop: 15,
  },

  subtitle: {
    color: "#B7C9C0",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 8,
  },

  languageCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#0F3529",
    borderWidth: 1,
    borderColor: "#245A47",
    borderRadius: 20,
    padding: 15,
  },

  languageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  languageTitle: {
    color: "#F1FAEE",
    fontSize: 14,
    fontWeight: "700",
  },

  languageSubtitle: {
    color: "#74C69D",
    fontSize: 12,
    marginTop: 3,
  },

  languageOptions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 13,
  },

  languageButton: {
    flex: 1,
    backgroundColor: "#184737",
    borderWidth: 1,
    borderColor: "#2D6A4F",
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: "center",
  },

  languageButtonSelected: {
    backgroundColor: "#74C69D",
    borderColor: "#95D5B2",
  },

  languageButtonText: {
    color: "#C7D0CC",
    fontSize: 12,
    fontWeight: "700",
  },

  languageButtonTextSelected: {
    color: "#081C15",
  },

  imageCard: {
    marginHorizontal: 20,
    marginTop: 18,
    backgroundColor: "#123D31",
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#245A47",
  },

  image: {
    width: "100%",
    height: 190,
  },

  imagePlaceholder: {
    height: 190,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0E3025",
  },

  placeholderText: {
    color: "#74C69D",
    marginTop: 8,
    fontWeight: "600",
  },

  imageFooter: {
    paddingHorizontal: 15,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  imageLabel: {
    color: "#F1FAEE",
    fontWeight: "700",
    fontSize: 14,
  },

  imageSubLabel: {
    color: "#82A79A",
    fontSize: 11,
    marginTop: 3,
  },

  imageStatus: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#184737",
    alignItems: "center",
    justifyContent: "center",
  },

  featureCard: {
    marginHorizontal: 20,
    marginTop: 18,
    backgroundColor: "#123D31",
    borderRadius: 21,
    padding: 15,
    borderWidth: 1,
    borderColor: "#245A47",
  },

  featureHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  featureNumber: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#184737",
    borderWidth: 1,
    borderColor: "#2D6A4F",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  featureNumberText: {
    color: "#74C69D",
    fontSize: 13,
    fontWeight: "800",
  },

  featureTitleContainer: {
    flex: 1,
  },

  featureTitle: {
    color: "#F1FAEE",
    fontSize: 17,
    fontWeight: "800",
  },

  featureEnglishTitle: {
    color: "#6F9989",
    fontSize: 10,
    marginTop: 3,
  },

  translationBox: {
    marginTop: 13,
    backgroundColor: "#0D2C22",
    borderRadius: 12,
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderLeftWidth: 3,
    borderLeftColor: "#52B788",
  },

  translationEnglish: {
    color: "#D8E9E2",
    fontSize: 10,
    fontWeight: "700",
  },

  translationTamil: {
    color: "#A9CBBE",
    fontSize: 10,
    marginTop: 3,
  },

  translationSinhala: {
    color: "#A9CBBE",
    fontSize: 10,
    marginTop: 3,
  },

  featureSubtitle: {
    color: "#AFC5BD",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 12,
  },

  optionGrid: {
    marginTop: 9,
  },

  optionCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#184737",
    borderWidth: 1,
    borderColor: "#2D6A4F",
    borderRadius: 15,
    padding: 12,
    marginTop: 8,
  },

  optionCardSelected: {
    backgroundColor: "#74C69D",
    borderColor: "#95D5B2",
  },

  optionIndicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "#5B8778",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginTop: 2,
  },

  optionIndicatorSelected: {
    backgroundColor: "#95D5B2",
    borderColor: "#081C15",
  },

  optionContent: {
    flex: 1,
  },

  optionEnglish: {
    color: "#F1FAEE",
    fontSize: 14,
    fontWeight: "700",
  },

  optionEnglishSelected: {
    color: "#081C15",
  },

  optionTamil: {
    color: "#A9CBBE",
    fontSize: 11,
    marginTop: 3,
  },

  optionSinhala: {
    color: "#A9CBBE",
    fontSize: 11,
    marginTop: 2,
  },

  optionSecondarySelected: {
    color: "#173D30",
  },

  optionDescription: {
    color: "#6F9989",
    fontSize: 10,
    marginTop: 4,
    fontStyle: "italic",
  },

  optionDescriptionSelected: {
    color: "#285746",
  },

  progressCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#0F3529",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#245A47",
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  progressTitle: {
    color: "#F1FAEE",
    fontSize: 14,
    fontWeight: "800",
  },

  progressSubtitle: {
    color: "#82A79A",
    fontSize: 11,
    marginTop: 4,
  },

  progressPercentage: {
    color: "#74C69D",
    fontSize: 22,
    fontWeight: "800",
  },

  progressBar: {
    height: 9,
    backgroundColor: "#1B4332",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 14,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#52B788",
    borderRadius: 10,
  },

  demoNotice: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: "#102F25",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#245A47",
    padding: 14,
    flexDirection: "row",
  },

  demoContent: {
    flex: 1,
    marginLeft: 11,
  },

  demoTitle: {
    color: "#74C69D",
    fontSize: 13,
    fontWeight: "800",
  },

  demoText: {
    color: "#9FB9AF",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
  },

  continueWrapper: {
    marginHorizontal: 20,
    marginTop: 22,
    borderRadius: 18,
    overflow: "hidden",
  },

  continueButton: {
    minHeight: 70,
    paddingHorizontal: 18,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  continueTitle: {
    color: "#081C15",
    fontSize: 17,
    fontWeight: "900",
  },

  continueSubtitle: {
    color: "#285746",
    fontSize: 11,
    marginTop: 3,
    fontWeight: "600",
  },
});