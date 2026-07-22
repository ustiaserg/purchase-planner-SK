import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Plus, Trash2, Edit3, FolderPlus, Package, AlertTriangle, CheckCircle2,
  TrendingUp, X, Download, Upload, Settings, Calendar, Wrench, Briefcase, Users,
  ShoppingCart, CircleDashed, CircleDot, Truck, FileText, ListChecks,
  LayoutDashboard, Clock, BookOpen, ChevronDown, ChevronRight,
  ArrowUpCircle, ArrowDownCircle, Search, Filter, Warehouse, ArrowRight, MapPin, User as UserIcon,
  ShieldCheck, History, Eye
} from 'lucide-react';

// ==========================================================================
// Constants & helpers
// ==========================================================================

const STORAGE_KEY = 'fve-planner-data-v10';

// APP_VERSION = datum buildu, slouží k rychlé kontrole aktuálnosti aplikace
// na různých zařízeních (mobil vs desktop) — uvidíte ho v hlavičce.
// Aktualizujte při každém deploymentu, abyste poznal čerstvou verzi.
const APP_VERSION = '2026-07-16-sn-warning-not-block';

const LOGO_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAIAAABMXPacAAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAAAmzUlEQVR42u29abBl13Ue9n1r7XPOvW/qCT1gHpoYiIkSQQBNDCIpUlZctlmVckmxXTYrifTDVXGiiJICjmVHiiVRoijarrgSWbAsl0WpJJUtOpFYCgdQpEiKYEiTmMduAA10Az2/8d5zzt7ry4/zGkRANESgAbBBvl23uu59/brvOefba/7W2ly49XpsrO/dso1HsAHABgAbawOADQA21gYAGwBsrA0ANgDYWBsAbACwsTYA2ABgY20AsAHAxtoAYAOAjbUBwAYAZ9ISoJNvnvfzZ//k6+h+0pn6mBUWBL3QRMHpXiJoEgCFG6BCZohBB+scQYfyCJq49VK9AcArsNsBEKKsZFplOVYTe3AyWV00ZVoHMZgyxkipSVXJ5882465MNyTgtBZhjASEGEFJJRTObHYUOnLxRaMfuvZcRGuWKQZEGz99bPKVO5+Qz+XpQlXP9hGvC1V05kqAKQEBtgGEhdH6slL70VveOvNzP/ujW3asAccc2UFEyJrl6c7PfX70L3/90U67hfGGBJy2EESCtbJcYIKJgsrcOP+D/+aqc7c/vtrej3oiEeGm3qMZY/S3fvzqz/7pia/9v500gr8+TPGZ7AUJ7IO9aEGTjJaqVM/PrCQ81lTLidmtd5baAmVt7Ks1l7ZvH7Vloso33NDTv7JC9mBAFWRkpewexW1qnBpAQEGgDlUpgewMXV8WVa/Iuw0VdNr7nwXoTZISKUAmEBBCsMFDEr0gkQERBBHwXlbAFvDXRUBwJgMAUBStJFg2K7K+WIQxo0ZUJguk8LooqBqq4HOW5630UPN6CcdeGwB08nE8+4YvFMo+95EF4IAgpxqLYt4FWjGKlYIE0FGKFbEnQwyWcISLHs6wk/8hXyhsfqEvJSCRptBrid2rCIAJFgjzYgYWKVfD7UXIOkssuREEQXJjDQjsAAEO1YCgCiDYkrH+NHUyG8FMC/JkaoKQhdCDefiZQLCAAUE0yQAYRIEKgwspmAqCym5AyMz7mHjNKLWCRKFkJEXKApQhoEE4z3gASJa8kMZLnfqUIgUxoaYe05mxrfVH+2LmF5WoSZqq0rs7xA7sIYcasYXGYI60JNUWFTSGnIKj9AgZCBrMEIICSUhBC4bBQAN7shOtsA4RhEckRBIS0AmiB5AcFidYlpsRUKaTjMTzPC3kUhhllDzaYhoXpIwI7wlQZz4AkhKXY3UCpDRryKbFmfGBv/cTV9ywZ/fy6vInfv/OO7/6WFWfo5jtS1811scUFoABxWz5OR7asMvteWpd39Yd3xlIU5EcJEaCg04QLEQ2ZYkdPWNVWK3MvSxtnn/8v/3vLrryTdsPHkx/8B8euveBZxCRbD4sTfKkSknZAlWwl68hDGpeByoogy2smWu66UrSkbO2PPPz7732ne9ocrmHPnfFG/b88kfu+cqXn0y8QDbO0cqmMEGJKEAHNcDLdecZZGFUXirBSISVsEJQYCELHZZGdZcnB7cuHPvQB6+59eaW2NtduuuHL731Fz/y+b/62hNVdUlgc5g6dpZ6yIIZzGT1QjbszIsDIlw+2/eRcGzHtkM/8092/1fvyJG/Dj3G7sFtmx//4G3X7nlLFfmZmhmCEGIGMkCoBuxl36TYyydCEWAqzolxmZiKfRCFJlWVj6YrB7ZvPf6hD1z7tpsnuX2gmx5K/f07d/6XD3/wTTfvsdI/wZgSVUGET8JWwZ6lQVSv1NN/VQGQe60erhNb5g/+zD+59N0/Xrf9/RXL2JIRJZ7YvPX+D3/4zTffVHft3lEKU4NIkKE4NYZetnRSjGxdWA7r5KuyY/Al2RTGIoKVg9EePHvn6nvfe9Wtt3Da7q/Mm9qD0cXendvv+dBtV++5vnd7DJq4VWBvtpbQpzJj8Uomul89AGjqR75c2yM/+zNX/p0fm1nr7qk8gLov4+z0lEs+sGnLA+/74NU/8rbR2vJjY7OUZ0xNncYln5ajIVCoCqswFO8idZEimIARVCX1NQ5t3bz/Z39u97ve3k/bvcmbnjMtLVclVUQ+tGvn3vd94LrLrziOOJgieZ6xcA94uMlfBwCQhFqVJ9/29m1v+9HxWr6nSorSdHncowT7AGpn6Z+e33T3bR+84l3vrPPao5XaSp5zWzUSysuP4VQhZqFRqC6oslU5mijj6KxmTjwwHt3/4Q+96e23Tvr+EffVjJIt9ywFVlS7DPmZ7Tuf+fv/8JrRaFEdLW+1vACYWMDyOgBAkjsj1nbtGtVJCvRhYSlSjzQ1ygAUNU6PwwsLd73//VfecqtDjzqPEGsFK2B52f4eBQ8yHHLBIyrE2NXMjTLzvs0LT/6z/3X3nj1rpX1GuTcJvlpsKgRlKZIZpz0c3L5jIRmdgupgXeDZusL8+pCAnAFbuPfuxeNHt6V0LujFp/CpMSqwDnPNpagNYH940+Z73//+N954I7p4IqVJqEjrcdfL0X7oK6xUmCT0REDu8sajXdm766zjt/3ClTffVKI8PjaMfQSkUBjkQCPVBSV7XW8p2vGtbxyYrHWWSthqsCuOYgzy9SEBNKvrXV//Wr799gdXJxcVNlAxhIexc+TKUGXURk8JpRzctPnRD37ohpveurA2PVAnEZSMMEkkhSDFwccHIaNMEBDPfiXBk38bzg5chU+ALhGmnvnpnWedeO/PXvPOH/FJ+3iyDpBUK5IzOZAAj0hUWFN44RfvWP2j33+Y3JQ5gS/CpoL0SmcpXkUjDPVR2mp09R9/cvXX/tU9GbsZnjJGUSOqAmSuKLXZTVZV1ng5tmPzvn/6vqvf+fa5leV9TZOBSsUrryOGLEVWJItKkUyzXM+4BQAWuuBywnNh+HyPhd48ql7sPTDC2uaZx2+77ep3vGNlWu4aNyJLseirHvVUyCazMs4YrWri9aVfuKP+9V+7a2npgrCt2VpZ75HqYqPSJfWvk3qAzG1cSpWqC//sT6e/8ZHHQj8cZS5HTy9FDC+ZXUHOUDCnqsv94/Pzj33gF65/1zvm2vY+49OJLF0yNqSV0puVPve0Yp6FDEiAlMgKUo6uxGrdFBFFKOiiV81ZKyeamUc+8E+vu2FPdN1hIwlBNeBkSxYLslTToq7MeH35Zz43+c2Pf/3E4raicwILoZE0ipiJGAfSK5uqexXjADLl3kr0famdl/7Z/6Vf/8iThde1nO3YVzXFIbUmoAglEKkK45PzC/d/+P1X/MitFbSv4qKym5pSjFaZg8kcfWhC5kEjQbXkMjeHfApro0zILiHNpoWYHNm8ef9tH7zorTevhvbnnFUqRA25oTeEiVDVR6ZXXl18x2dGH/3NBw4enbXmgrY0Yg2NFOOCJrPuzAr4OpEAyI0pQc7CBfiln/zPSx/9jQfX+mt6zEw1GUwsQaAS6gK63Jg99m/ZtO8Dt/3QTTfWEU+M6zVERyRaXcLryomeDlGAERXkYZChR+uNoldlZhY1Urv65M4dB3/+F97wN25lX+5zO16lziwKAbawbKJKMiWmJN/1l1/xX/nV+44v7mR1/jTXllRiSmVDgEXWh/dh8Qo+I28uPPfVMwKltEhW1IVPZdE0m+/61sGlpbU9e3aDzySYryPgiMbgPTIg9yh5OhrbjW+5Yt/jR/fuPTAaNyU3KtNzdq79xE+cbf54coUAOiLRFGiLwrjtgYdw1zeUsJOlt1jcuuWJ2z5w2Y/eqtXJIzPJ3IpQMmCeQRmIqGhVG22dLvrcX1S//Ev3TLoLOm3NmLHKAivJ1xJ6kxGUd/I1ykzV6wAAIcwZMnjIV4KTnMeVn7P3oYOHjyy+9eYr6mgZrTEYclaZDgtZiHSvc56M5rrrb9z91FOLDz98YGF2oVtbuvKq/t3v3mlxQArC1lOkbIUQCG45fGT2zi8et7yj8sXRzN4P/eJVN791pfQHR96YeljIQKMoExlNkTr1dX3+pz/XfPyj+1dWz+swos+VINkDaxWLFZkaIAUEFspewWD4VQQAoGBUAxkZAmgz0rxp9pEHjx47tHbTnguFFbJzU1YOKsiTJV9LxtwfaUbtjTdeu3//ib0PHRw3y+/6sbOufzNUjgIAfajRyIqICMjmjDu+fMfj0+XJ/KblD/6zN+25ccV0gIOuZxYMqDRIXqSulEx4dcEdn68//rH9R47sQjqrZ0GpnEkoRjBoahgjqgYccNMryXh5VSWAQkVVrmQlAR5iSCE3LTz84KEjJ47dsOda+FporTLISiAAETIMxa5iWqsq3PTW3Y/vO7x4YvpTP3Xh9h3Hum6xrqsyREWCUQLIFKXaPDe6967JiaPH3/ehN95yy6idPGZoq1TAIrliDiSsMJq+UN7Izv3CF9JHf/WxY8d22Whbq858ZGEGCCa6VEMNkIaLkhwUEa8HAAhRLk/FDCQlC1QClMzNx9964NDxxfaG6y9zLIZ6moZQKwEJFmEJMoIl5ma7a646Z/Pm1ZtuGcuebow9enoQsiFiA4BaKjN1N2rKnj2zP/bO8crksQqlThksIqBaqGEZaE1V0ayn3V/50sz/9kt3ra1dXLi1eMBYckosYA5jwIVaIJhlHawPghBfuXT06QKg9Yosn1Oc4kkAiixccBSip+ccHc2KOvOVQLC68J57Hl88dvjWmy4za2WZlEEW9CAsFQXF2qzEoYUFXnvtlowD4KRyC4QIJ0wVIiQTKnrptHjRBePL31BP+n1NRXiriBJOS5DB18DejCX34/qSz37afv1X712bXtRbExXFWqiNvXFN1hdjMAUJK7IJfC2sAwt1MhoHgefmS/gcGsBrAkCxHF4Gn59KVAISYEHJerAQQZZgCc/BQqcinDAiYEV15Zsee+TY08+s3vjWK8BjhqnBFGZeCjM93BCW6Sox6WPJvDWDIBdSJIsGqmCSQyBgZoS1Wct1YkaRuWjmZgFTuKjC3I9HzRWf+Qw+9vGHji6e0/v2SF4wpUWUiacMrbMlDMXRG3pDHhJcBgguVMFUzMME64wtmSlHzEAJLyVbd3oSwHIyFfPcvRCgCBiSRUNVQoIqqGbUhtqiVoygRl6oRmX20YcOHzu2fMONl4NLitYTcwGGgJXSoGFMAw0Cz6G1iJTl8BIMkoRDFLMNQR4pGikiV8ouZtWhhuncv/j86Dc/fu8zh7ehekMfjcCExDBXjagsRtTIVJvc5KZENVTDaKjaEIYiEqQBhmwog+4UKhF8zQAwuUVtUVMVQLGQHYYAVYmx7jbw5AtwaP0noAVd7IFINvvAvYeWFtvr9lxm6XivNtm8McBT2rpC9FSwiPFseww1gBCEhrYCDJacgtDJeluQnf+lvyr//FfvO3ZiE+uLp12dKlK9h6UYMcaMCuRw5S/4crSOKSGXUsBkroqqglZMYthLsRCnBYBH7WUE1UBTCFgna8WeMFcFQN7COlj/na9gCZIuhQMLVdp29937F5eXb9xzKTGBMtjbqcsBgbpgKN8/G9ObQaZiz/Z1rKemoYAx9bHg1Q99/kv6xV++a2Vydm+7eo3gWTiROHGAYaDCetkpLxvWU4UQQQOHoMwiAR6mnDIY/lJSpqcnAWzJSZiCkmfZFNZyPVRpAMqyhnzZ814EaSogUkQSqhLVzHj+gXv3Hz88ueWWK8hF2uTF6jEaEyOyGMJAwigQQQqg+KwOSgQJ6/u5cfPGP//02sc+dvfSyrkZu4Q5phRlrUqtMxAJqLKppA4oL3DNOJk6URKaQg4Rna0nximLYsUgk71WNsAm4hTmMAdoRqOZGo8ZizmD0VszGGA8+TIYYYAj6qpVyWZIqZi3yiWpfuTeAwf3L924Z1dVrbyINXMpIaoh2AuHZBZa9xCTYGBACUqEqXjyuU9/9vhHP/rwiaWU/AJ65VSUtvKussyAsZGlkvqopgYk2PqVn7zg4eKdgI16udxALxGeHBGkwBjIrHwpGbaXzwsimfs6+dg9lX6N6vvpkllvKFIqSgCVu1MwOEgURmfWBNFrAuvqkc82/UXnVhe9oYo4TpY4tU/n7BU9o6kw15c+1eWkKWDACTAADgmDMHMojyq8+bot9z50/OjR+7TWhBrzKtRPS5ssScuZVZ+mJdbqvlGkF75ysg9GNarSbM8q1anr2sqdCgop7KU2RvHlT86VzDdFKPcHR/XR887VZZdughbNWrBIIVTQ+NQG3Co2JUqOtTTWpk3pvAtnL7m4ueTC/pyFbi0OGsvgW5ziy0GNynT74vH6rO0lp6fMegFCAqqhoyMoWSaKichNU+1ai217n6gf2rt45InJk/tX+pwKS6gzGFQFUva++KQqtZ0CAAFM9eET/Obdh0rsyHmh4piluIbUSxXgS3JDT0sC+q7zKo/GB66/rnzgfe/csW3ZsUj0QikDv2qdpP9c5vPwXoSH6ooUuoxsMKIAK8LK8XZp5FV4eZGn36Fxu+J3/8NTX/vy0//8V2496+yq18NGUgkIQxAGZmCQDCXLa+1Bs6XdF9WXXmQOCdsC8xOsjRBERySiCSDQn4yn9BwGHJ/FnZjt+nM+9enDH/nYlyMuDo7I4Y6IML7EKPnlAyDIkxFryVd++qdu3bVtb2kfcu8hDySYgZl4keqdRamnbIlCQ4gqFWSVe21h1pUXtsAUJMHt0j/5c/3BH65MT4w+/i/v/vkPXLowv5TjeCKMGSgYkh/rz9KouiEjFqPPIszQlaO9Zo2596WasIBHQtSisvdxCg+YgGdY3vI337Hny1+84I4vtnQvXIeNdApg/u6pc6fDDSWAkqt6vHDWzlL0hFWd5GRvKDUpKE7txlBy5oGLThs46l0JZhkTuwAxW5ATOgu53OF9lGAtjse+848/0/+rf/Fwnl7cNNs/f8e9qO/+ufdetXlTozjEKMnQmQQKngVDHQbjFJFTokJBpmRRpmIxM0ogwgLMQ1h/ag+YQbM6nId27PA8PT6eQ4TLsilgq5C9pGzEaZFzhQmByElcBNeKLFCTsKG9BSh8MfScBF2QpBgk1wCEkGieSxEzwAQzeRRGJFbb+nLen/zJod/6nb0rSxdWmuvgTBd+7tP3VumRn/7py8/bVZf+ANIUpggWmOCyCMtApqMIBHsAnPJkfbdwuFQBf23BXUzVNIwe4GrlhRJEyqlCtiCl8WsEANjR14y9oScKKKkTWJCIGugNk1PfR+nXEzhOGSXCyACG1ENvVhJRCoMq9M68anYcWTrrE7/31B9+4qnw88zGTF1fjnmEV+d96k+ffPKx//I/v/e6q6/a3uW91h93RyUAfSlhHhoKOHTZwLF42dHPtIICQQ1BjIsETCA1wkvMVJ8mPb2GAiLVGAzI8lwAoRemBprwQkZ4EGSVk3Gs0SgHZQoikxgSK7nAlbqoVI3Nd371Hr/9tx/4+tdSU7+xLyNY16ujUxhBZ9O2PvDwwZ//X/7yH/33l7z7b+/e2jw5zYe7flInNmYqVbAKAixiOdlk8fyres775338douVQWQnQOGCBy1QyJASZEB5SXy+01NB8lAtEGWB2Ko4RhYHZSYkIICOpxhuwufQAoZstoQiGAwSpZKZqrlW83V1wUNPlv/8qQP/6U8OrCxt8nRRH1uy1lwd5GAdGndllDjXZS4u5//9X+/70heP/L2/u+OWPXtmxk+EniilJ4sQQioRZEkc9sXz3NwXnMDyvPfiQIYpDVCJViwCGQgbqN0UXgqr9bQACAuxKwxwU8mbLVpxBTALCDS46Bo8Nz3HiwEhgVazLlAoa8haq0+oO5BmyZrkO5bWth94au7Tn9v32S88+shjqptzkp9b8ljWJvQ+UNlKCgHoCrpUVcLZZbpw551L99974IYbl/7239p+7TWXbp5bdbShrkQbnJYCkC7SKKGUQjc+uyue3b/P/XjyPcG+FGohfEvJKyVOmPVQR9kpUHx1bQDo7FW+9OVHf/LvXNr3qKsxAEM75MvixZp1aaJDsF6IAIhRwbiUUdfVJ47lu+5duvMrD939zfLY42xmz28qMrZGnkkQMCXFqCCQ4dYPjykGZcg5pvNOtGt/9tm9f/lX913zxplb92z94Wt2n3/hqJo55tXRxnpHEhQoACo3vSTHxZN0zqGn575119Mzs1va3Jpnqhq6b8D8ksg+Lz8SloRq3Oeu4ZNn73jqPX//h666at78CCHnChVC3Vs61a0RkaI1Y0htQdulw0dx7Fh1YD8e27e6b+/iM8fqLE9pzm1zKbNRDBDZGTMkqBYqsAM7rfvdDlXDK5s65lEdNab9ytEU05lRe955uOzKuYsvi9n5fsdZ1fzcTN3UISnCzL7ruwa56cTx2d//gwfv/GrJsT1SCutYxowZYwu+tFFFPJ1DfLIqyiouJR40TmbnQesVnlBckNj7/z+cfI5JpuhFQ1KiSAGuTfpQ3bbjksej0ZYem+BVaMWsMJwaqSRQ5FS2JlSIkVjIDMRQfMG6A2wyhiMiUCLRRo7Sr5ayCq2kNDHvm3FfVabwkKVkUnz7Ol/EMHM9Cz9pu+nqvOGCUmasybm00DxiDFuGdYjRa6SCKmYDnE2JHWEzzyyuhbcsmwxtClFeLL6devh2JEtQkFE+0Ic4JNfdFEqjlMRcIsOpCHUWRKkk0TqxC0RgXCzDVxkjxixEQwzs3SGSQEFVAG8KKWK1ZEtjSyPEtj6Si9PVNSkkEaC5dNJTGK7t1DYAIlJXIje2OfdzRqpddE8RlZREgi+NQJ1OR/8r96mp2q6rqpk+6iBhM+KM1IQFB8bCKXaVqMwMuoEoz2ZzkbNCvSUnerE3QKgikgRnBjsoWTSC5P3JgI+CDSnW4TuMbqpyjwIyGTgImYzJkEo2WSMICWFFKuuldJngIkzx7JZ53hS64aMbQgn0UO+pCpGQmCEiXhpni6d9jtjzRfe7NGhBZSsiTPSwk5SUIaFPQVivBg+UfAI0wQMeNLGYgoF1dsJzN53Wk4Cqhn879BAMkZIJBlKQUjFlL2IBs6lQgFKgDjOP3v7aeEpDH9Y6L+Q56hWvoRf0HVQUfNfuBGEeQ9lEQ3Ff6/mvof5BX3erIxhiEdeBCBt+b+AlfmcXzfBbPTnROrnqpE4ZHPhB78DAdYmxQldFUTCYoPJdJTTXQ5cXCSNeIwBeLm5hKWYFgFnMwQyWwYQSRpmV4fmEs4ghDnqBmQ7A9GL0tJPsnAIOcSkFQ9ShJNVAwJZlvYFQSlFZVFQKBoZW7NdwWsf3DgDI0A0WM6iwbw83oUBKJoSGoZUIwowwwSEXLdA5uhcJ0aF60GRgDI0IhWZgMFMChxuXkSdTaTyJWYb8NRtl9b2bF8SMtLqejKCBJG2gAYEKRZ/kROTigHuChnERIoto1IuG++ZSUikigEQgWIAo7EgJBjWIihY598kTFILCSjBiqOLr+10CRMTQTSzVyUsZdis1UErhYf1a6cbNKPdRSklOqSdbYyGDAyfulAayD7beGKDS9SSTpQgYk5mXiKpS2wVk5qMuiltvQFBBSOkHQAURKgYuhPqm6tvVwzmvUBAs1RVQp2omRzXbzLeTYmjMq1wKmcGOyoasIdP8Ivia+txX9HHVROmQp44ul+ny2up4XK2tLHo949X2gnnBZHL2AYoVMEhbfF8DINAsBLe16A9cfaX/1+/+4SirBw4ePHj4+P79hw8+oyOHjO22UTVPWyhKwUoDBYpOtYC/CAAKOr1ixVBpJ3l6ZNOm6bbt7TkXlPMvGW/ZMtq17U3f+MbhP//sU31c0GkeNoydCypBTpTvdwkAJLi5c/nC81ff9wtv/6ErCrDcwaflwsPHqqcO4p47V771jSMP7H34+Op82HZWZ5VSS/D1IR6n5H9I8ESU1bY9OqpXL9nNa67a/Obrtl119aaFhbX5+dwgAos//q43N81Dv/eHB+qZLbmARiKSiJJkIX5fAyDJaER0k3LB+dve8Ia82n21slWYKvrZZ+04e/uWW689e2X1nG/ef/STn3r8S1/Zd2L5UPILwAUKgTJ44DwZaZeQuUcpyeAW0R9L6Zk372ne9WO7rntLumgXEo5n7I+ARdP2be6X5uaqq65umv/UqohIjIoYeHVFr5X++Z4BQFLskKYlk8w9n6mqnPNCQuvoo10kj63oqTQzuu4tcd1bzr37bv+Pf3Tks5/dF7y45yjqMHkqUHQRnVVVLwOrQOtcjtVDl13W/4N/dMmtb9/ejB53PNXlSaGZxgaKx63KbgwcZu3GFkpkSJWQxCxbgqofADcUMtGUiAmtBzs5imWpqJqahaPkvJwMfRy59ppzrrry8pvfvnj77Q898mg9qi6ZTi27Q06vA6WuquhzlVdH6bGf/Kndf/cndmzdejjKAyxrgb62BFDsxSIWA5h94DqTEchiFgqUKCOSfhACMcgQM9CaCa5wBjgNoBDZSdhYuUnsixq3XJ4qOPK2Hz3n8iuu++3fevT/+dR9M83lU811iqpucjtpop3F8jk7j//j//HGm97R0+9CWak8RVj0YE0N4TQIVBGeohhqqoIY3hVrJVkAUTEqWH4FZ2K9+Pqeji5mD8sAGDWRhpw0QCEJLlGhxmoUt0g129LuO3vX4+97/xv/4Xvm3e5LOlGPylq70oyK6ck3Xrr0G7+252+8s434Zs7LEKXe2dV1RPREmEA5NLKoDYUwRBWwsF6WxTJk96Aa8h8ACaBKWsu2Ao6Ut0gLzklYdpMiaD2ArBRKRqOFYDPJOh221P5P/8PZm+b4f/4f9zW4OFLVTp9461vsl95/zXlnPTht93tVaE6giGaMkA0RNMwR4hRUMCSTRrBqSISDxmd7v17D9b1zQ2GKOdnStAO4SdHI1lRyxZSAHCgxW1lTNBFaIdMEmIHEiUksvuc9l9cY/5vf2d/l+s3Xpw9/+MKdWx/o22Xz1JqJBUJlzCJRWZgZk5U+2lIiEW1G1WxZm1Z9rmGOaBiJIpCB9kU6c17x9ao2ar9YKreIwZnKubL0xBt2b77o4k3J6V53uSBKshCsVw/vAoXrxP/1qbWEoRy97k3nHzq0VsrKbe9/y/lnHyhxxM2KNcUiI9KQWpM7K5ChvlcfqIYic1O/4eDi1tt/9/4nnhhZWoCM0bgI617Lp/+9BABEYVtXmi5P775738ra3NJkPM2b5ufPG9WjDpM+prVHGeymsTyn8mA0qnWbvPHKzde9Zf6SixRxzL0XEQw8W+oMjL2OKH0p5rPwXeDup5/e+vDe8Ze/Xv3W7d/45rcK/ZwCmMxiBAJsxaGO9xppotOviL1sFZTlrYMNmn56ou2Ozy4s7dhZXXzx3K23brrl5s07Nh3t+iNA0EsuXVVhnZimdQaKZK6qSvXaaviolk3BCSCTuxqVsBRFfRdw39mV8++72++447H7H1h9/PHl48u1bCHZrj5mLK16cStbREVaLiaGv6Q2o9clAKQN6UdXnZIXXyxa7vquSW0/XbzqcrznJ3f+zR8/py0HlY6Qq+4GxVBkJBW0tmgEQpGsmURGMqA3oMpVFTOlZKvzWpfnxhff/VDziU8c/PxfHJv2m6d5ZGmhStuEUS7JvAs9XaFCv0VAqVaKgWHf/wAM5RfSEAMzItNEMJTrlEu3MsKBt71t4R//zPnn7Tg+7fY3CUQ2os9IVhf0MmKY56yBllI5BWQieTByLr5V6fI//KNnfu/fP3Xk8KylTWEzwZlQDYUUNCNCnFLDrF6IvQYb8/1tA76th1DWe9vWK+8weo7KbD5i0yN7n7n//oO7d1+4a9fZXbdG7wRVCV1h5QZFoAmGGEZzeZQMU5BdwNLcWnvRb91+7N/97r7F5fOq6rzgqNDKwC1hJgtQTh5UYKCG4iVfWz/0ewsAXnC4Aoehiz7nnDn0dPeNr++/8YYbZzfBbLFXLoC7B4KE6KJsoIKUSAmkSjba9rZc/G9uP/Dv/v2TwoVen90HY1BeLEPVly9rtMP3HwCnxCUDXm3N3dzKsh7d+8gNN13s46NmayIYdVFvxoCDIArFZAZEFog5+hV//Mml3/63j1m6jOniNofYneSvDKfN2BlywskZCoCAsEmJvkqzo6rZu29fGk2uv35X1iEXh/4iEcAwvUcDT6pIgtd2zte/Of6VjzzY9ecyndMWmvW0lsgmApUp8bVK9ZzZuaAXEwA5QU6CJyZ9Ozu7408/+dQ995Q5O48hL72dzGcQQWgo+YIA5xZX53//E/cvL25339rHKrkiFIZ5wFXScEroGbPO2HPEjHneYkYopEM7Fo/O/N//8ZkoO2ufoQKKb4sKGFHMUy7W2Llf+eryN7+x2lTbQp3ZirFj1FbmPGpDNkzI9vmUqg0AXiBOKPMs84g6UPdlS6ou+vqdRx94WM7tAXAwAOvn9YB0gZn1RPN3fGFxcWnGTOtNsnKPxGjWDyRgJ2tfyVNgvk8BENiJUZAyU0eXLxw9MfONr69lbRUHGtdJTSKZ+WrX1Wlh75OT+x9cqppdoUCMUOagSuxga8EI1BlNnEmnp52xAITSsUjH5G2xPqzrGVn2rbsOBnZ2kYb53SfdGgSKpco0s3ffypHDI9oWqY7YpNgsmXxJ6VhYW1CHFkKzOmNu3M7Y/Z9pYeFcq7BinJinTjNPPaPVVcx6M9gAC0+FLqjkqlQ9N+/f75N2JKuKCIrMxqBMSgLBIIbXhgT8dTZAmkXMerEqShXKJVm164mD3Rf/8uA4XZljJmiwMW3eOGdcUDp7aensz336aeNs2xc5wNYwMRWqhsZAAoJsDT3OGDf0DD7QOZKJhhlDyXCqKr5pabLtX//bB7v+Tde/9QbUR700HhWiApqnj+Tbf+fOJx4DeJb5DLT8HaHFGbnRvnfJuL9GBYVGrqgwNUVmalmrqoU1tyPoj85WXtnQIw5BdMs5Vid1NTo793MSaK+PY+XPWAkI2poQiAKIKHWNtdLCq1K2NGnLWts5hyNvC8jcwVixZg6IJ2iOV26+9g+oCpJNCYUSZQbk6ep4VPXRS45S01xoi2VZERzWCKM8zU3lBAws0MZ5wqdtBWShhkqUauuia81KwKECNYEROMw3EBgqkdIYJVymYUzKhgScRi6IiGbompPcIYaRoLIxIIVG0AzVUBNZD4gqxHRo3cLJ6sIGAC8fAh8mwQCRihSGMDlhQwQgFLClYKVGpGCYhl4wFhgQ38Xknw0AXvzKQmLfew6PgmKih1s4kIIkV4klRG2qMLTpWj802RQlfOfhtxsAvFQbLBZAhhwKUIBp6OUbdjqDyOAwJmngqMd60wBjfX7xBgCns9ZHEKtKz29XCSAQtVAP5kLr0wTSoP8dr6dl2FgbAGwAsLE2ANgAYGNtALABwMbaAGADgI21AcAGABtrA4ANADbWBgA/COv/A+H5aNGRYIhXAAAAAElFTkSuQmCC';

const DEFAULT_CATEGORIES = [
  { id: 'panels', name: 'FV Panely', color: '#f59e0b', kind: 'material' },
  { id: 'inverters', name: 'Měniče', color: '#3b82f6', kind: 'material' },
  { id: 'batteries', name: 'Baterie / úložiště', color: '#10b981', kind: 'material' },
  { id: 'mounting', name: 'Konstrukce', color: '#8b5cf6', kind: 'material' },
  { id: 'cables', name: 'DC/AC kabely', color: '#ef4444', kind: 'material' },
  { id: 'electrical', name: 'Elektroinstalace a jištění', color: '#ec4899', kind: 'material' },
  { id: 'monitoring', name: 'Monitoring a komunikace', color: '#14b8a6', kind: 'material' },
  { id: 'other_material', name: 'Ostatní materiál', color: '#64748b', kind: 'material' },
  { id: 'labor', name: 'Práce', color: '#0ea5e9', kind: 'labor' },
  { id: 'subcontractor', name: 'Subdodavatelé', color: '#6366f1', kind: 'labor' },
  { id: 'commission', name: 'Prodejní provize', color: '#d946ef', kind: 'commission' },
  { id: 'project_mgmt', name: 'Řízení projektu', color: '#f97316', kind: 'commission' },
];

const PALETTE = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#ec4899', '#14b8a6', '#0ea5e9', '#6366f1', '#d946ef', '#f97316', '#64748b', '#84cc16', '#06b6d4'];

const STATUSES = [
  { id: 'planned', label: 'Plánováno', color: '#94a3b8', icon: CircleDashed },
  { id: 'ordered', label: 'Objednáno', color: '#3b82f6', icon: CircleDot },
  { id: 'delivered', label: 'Dodáno', color: '#14b8a6', icon: Truck },
];
const STATUS_ORDER = STATUSES.map(s => s.id);
const getStatus = (id) => STATUSES.find(s => s.id === id) || STATUSES[0];

// Vyfakturováno je INDEPENDENT flag (nezávislý na status).
// Za starých verzí bylo status='invoiced', teď je status='delivered' + isInvoiced=true.
// Fyzický průběh: planned → ordered → delivered.
// Vyfakturováno: samostatné yes/no (může být zálohová faktura před dodáním, nebo dodáno bez faktury).

// Výchozí lokace skladu - 1 hlavní sklad + virtuální "Na cestě"
const DEFAULT_LOCATIONS = [
  { id: 'loc_warehouse', name: 'Hlavní sklad', type: 'warehouse', notes: '' },
  { id: 'loc_transit', name: 'Na cestě', type: 'transit', notes: 'Virtuální lokace pro objednané, ale ještě nedodané kusy. Automaticky se plní z objednávek.', systemLocation: true },
];

// ID virtuální lokace pro objednané, ale nedodané kusy
const TRANSIT_LOCATION_ID = 'loc_transit';

// Speciální virtuální projekt "Sklad" — pro nákupy, které nespadají ke konkrétnímu projektu.
// Vytvoří se automaticky při prvním potřebě. Chová se jako běžný projekt (má vlastní items),
// ale je označen flag isStockProject: true a nemá client, contractValue.
const STOCK_PROJECT_ID = 'proj_stock';
const makeStockProject = () => ({
  id: STOCK_PROJECT_ID,
  name: 'Sklad',
  client: '',
  power: '',
  contractValue: 0,
  vatRate: 0,
  status: 'active',
  isStockProject: true,
  items: [],
  budgets: {},
  clientPayments: [],
  createdAt: new Date().toISOString(),
});

// Typy skladových pohybů
const MOVEMENT_TYPES = {
  receive:  { label: 'Naskladnění', icon: '📥', color: '#10b981' },
  transfer: { label: 'Přesun',       icon: '🔄', color: '#3b82f6' },
  consume:  { label: 'Spotřeba',     icon: '✂️', color: '#f59e0b' },
  adjust:   { label: 'Inventura',    icon: '📋', color: '#8b5cf6' },
  return:   { label: 'Vrácení',      icon: '↩️', color: '#64748b' },
};

// Kategorie, u kterých se vyžadují sériová čísla (panely, měniče, baterie)
const SERIAL_REQUIRED_CATEGORIES = ['panels', 'inverters', 'batteries'];

const fmt = (n, currency = 'CZK') => {
  const val = Number(n) || 0;
  const sign = val < 0 ? '-' : '';
  const rounded = Math.round(Math.abs(val));
  const str = rounded.toLocaleString('en-US').replace(/,/g, ' ');
  return currency === 'CZK' ? `${sign}${str} Kč` : `${sign}€ ${str}`;
};

const fmt2 = (n, currency = 'CZK') => {
  const val = Number(n) || 0;
  const str = val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ');
  return currency === 'CZK' ? `${str} Kč` : `€ ${str}`;
};

const toCZK = (item, rate) => {
  const amount = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
  return item.currency === 'EUR' ? amount * rate : amount;
};

const ymKey = (dateStr) => !dateStr ? 'unscheduled' : dateStr.slice(0, 7);
const ymLabel = (ym) => {
  if (ym === 'unscheduled') return 'Nezařazeno';
  const [y, m] = ym.split('-');
  const names = ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'];
  return `${names[parseInt(m, 10) - 1]} ${y}`;
};

// ISO-8601 week key — week containing the date (Monday-based)
// Returns 'YYYY-Www' e.g. '2026-W17', or 'unscheduled'
const ywKey = (dateStr) => {
  if (!dateStr) return 'unscheduled';
  const d = new Date(dateStr + 'T00:00:00Z');
  if (isNaN(d.getTime())) return 'unscheduled';
  // ISO week: Thursday trick
  const tmp = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = tmp.getUTCDay() || 7;
  tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil((((tmp - yearStart) / 86400000) + 1) / 7);
  return `${tmp.getUTCFullYear()}-W${String(weekNum).padStart(2, '0')}`;
};

// Returns the Monday ISO date for a given 'YYYY-Www' key
const ywMonday = (yw) => {
  if (yw === 'unscheduled') return '';
  const [y, wPart] = yw.split('-W');
  const year = parseInt(y, 10);
  const week = parseInt(wPart, 10);
  // ISO week 1 = week containing Jan 4
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const jan4Day = jan4.getUTCDay() || 7;
  const mondayOfWeek1 = new Date(jan4);
  mondayOfWeek1.setUTCDate(jan4.getUTCDate() - (jan4Day - 1));
  const monday = new Date(mondayOfWeek1);
  monday.setUTCDate(mondayOfWeek1.getUTCDate() + (week - 1) * 7);
  return monday.toISOString().slice(0, 10);
};

const ywLabel = (yw) => {
  if (yw === 'unscheduled') return 'Nezařazeno';
  const monday = ywMonday(yw);
  if (!monday) return yw;
  const mondayDate = new Date(monday + 'T00:00:00Z');
  const sundayDate = new Date(mondayDate);
  sundayDate.setUTCDate(mondayDate.getUTCDate() + 6);
  // Formát: "13.7.-19.7." nebo přes přelom měsíce "30.6.-6.7."
  return `${mondayDate.getUTCDate()}.${mondayDate.getUTCMonth() + 1}.-${sundayDate.getUTCDate()}.${sundayDate.getUTCMonth() + 1}.`;
};

const uid = (prefix = 'id') => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

// Normalize for accent-insensitive search: "Čermák" → "cermak"
const normalizeForSearch = (s) => {
  if (s == null) return '';
  return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

// Returns true if any of the fields contain the (normalized) query as substring.
// query: raw search string. fields: array of strings/null. Empty query matches everything.
const searchMatch = (query, fields) => {
  const q = normalizeForSearch(query).trim();
  if (!q) return true;
  const tokens = q.split(/\s+/).filter(Boolean);
  const haystack = fields.map(normalizeForSearch).join(' \u0001 ');
  return tokens.every(tok => haystack.includes(tok));
};

const addDays = (dateStr, days) => {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00Z');
  if (isNaN(d.getTime())) return '';
  d.setUTCDate(d.getUTCDate() + (parseInt(days, 10) || 0));
  return d.toISOString().slice(0, 10);
};

const addMonths = (dateStr, months) => {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00Z');
  if (isNaN(d.getTime())) return '';
  d.setUTCMonth(d.getUTCMonth() + (parseInt(months, 10) || 0));
  return d.toISOString().slice(0, 10);
};

const daysBetween = (dateStr, refStr) => {
  if (!dateStr || !refStr) return null;
  const a = new Date(dateStr + 'T00:00:00Z');
  const b = new Date(refStr + 'T00:00:00Z');
  return Math.round((a - b) / (1000 * 60 * 60 * 24));
};

const todayISO = () => new Date().toISOString().slice(0, 10);
// ==========================================================================
// Role permissions
// ==========================================================================
// Role:
//   - admin       — bez restrikcí
//   - finance     — vše kromě úpravy uživatelů
//   - management  — read-only přístup ke všemu (přejmenován z 'viewer')
//   - editor      — Přehled, Projekty, Nákupní seznam, Objednávky, jen kategorie v Nastavení, profil
//
// Views: dashboard | projects | project | purchaseList | orders | stock | cashflow

const ROLE_VIEWS = {
  admin:      ['dashboard', 'projects', 'project', 'purchaseList', 'orders', 'stock', 'cashflow'],
  finance:    ['dashboard', 'projects', 'project', 'purchaseList', 'orders', 'stock', 'cashflow'],
  management: ['dashboard', 'projects', 'project', 'purchaseList', 'orders', 'stock', 'cashflow'],
  editor:     ['dashboard', 'projects', 'project', 'purchaseList', 'orders', 'stock'],
};

// Settings tabs accessible per role (skutečné taby v SettingsModal)
const ROLE_SETTINGS_TABS = {
  admin:      ['fx', 'categories', 'locations', 'paymentPlans', 'pdfArchive', 'backup'],
  finance:    ['fx', 'categories', 'locations', 'paymentPlans', 'pdfArchive', 'backup'],
  management: ['fx', 'categories', 'locations', 'paymentPlans', 'pdfArchive'],
  editor:     ['fx', 'categories', 'locations', 'paymentPlans', 'pdfArchive', 'backup'],
};

// Helpers
function canAccessView(role, view) {
  const views = ROLE_VIEWS[role] || ROLE_VIEWS.editor;
  return views.includes(view);
}

function canAccessSettingsTab(role, tab) {
  const tabs = ROLE_SETTINGS_TABS[role] || ROLE_SETTINGS_TABS.editor;
  return tabs.includes(tab);
}

// Management = read-only. Všichni ostatní mohou editovat (s respektem k canAccessView).
function canEdit(role) {
  return role !== 'management';
}

function canAccessSettings(role) {
  return ['admin', 'finance', 'management', 'editor'].includes(role);
}

// ==========================================================================
// Outflow payment computation (supplier side)
// ==========================================================================

// Resolves which date drives each tranche:
//   - If actual dates exist (purchaseDate, deliveredDate), they win → "actual"
//   - Otherwise use planned dates → "planned"
// Supplier.balanceTrigger decides whether delivery or order date drives the balance tranche.
function computePayments(item, supplier, totalCZK) {
  const depositPct = supplier?.depositPercent != null && supplier.depositPercent !== ''
    ? parseFloat(supplier.depositPercent) : 0;
  const netDays = supplier?.paymentTermsDays != null && supplier.paymentTermsDays !== ''
    ? parseInt(supplier.paymentTermsDays, 10) : null;
  const trigger = supplier?.balanceTrigger || 'order';

  // Manual override wins
  if (item.paymentDueDate) {
    return [{ label: 'Celkem (ruční přepsání)', amount: totalCZK, dueDate: item.paymentDueDate, triggered: true, kind: 'total', basis: 'actual' }];
  }

  // Pick the order basis: actual purchaseDate wins, else plannedOrderDate
  const orderDate = item.purchaseDate || item.plannedOrderDate || '';
  const orderBasis = item.purchaseDate ? 'actual' : (item.plannedOrderDate ? 'planned' : 'none');

  // Pick the delivery basis: actual deliveredDate wins, else plannedDeliveryDate
  const deliveryDate = item.deliveredDate || item.plannedDeliveryDate || '';
  const deliveryBasis = item.deliveredDate ? 'actual' : (item.plannedDeliveryDate ? 'planned' : 'none');

  // No supplier (or supplier has no payment terms): single total tranche on the order date
  if (!supplier || (depositPct <= 0 && netDays == null)) {
    return [{
      label: 'Celkem',
      amount: totalCZK,
      dueDate: orderDate,
      triggered: !!orderDate,
      kind: 'total',
      basis: orderBasis === 'none' ? 'none' : orderBasis,
    }];
  }

  const payments = [];
  const hasDeposit = depositPct > 0;
  const depositAmount = totalCZK * (depositPct / 100);
  const balanceAmount = totalCZK - depositAmount;

  if (hasDeposit) {
    payments.push({
      label: `Záloha ${depositPct}%`,
      amount: depositAmount,
      dueDate: orderDate,
      triggered: !!orderDate,
      kind: 'deposit',
      basis: orderBasis === 'none' ? 'none' : orderBasis,
    });
  }

  if (balanceAmount > 0 || !hasDeposit) {
    // Pick trigger date & basis
    const triggerDate = trigger === 'delivered' ? deliveryDate : orderDate;
    const triggerBasis = trigger === 'delivered' ? deliveryBasis : orderBasis;
    const triggered = !!triggerDate;
    const due = triggered && netDays != null ? addDays(triggerDate, netDays) : (triggered ? triggerDate : '');
    const balancePct = 100 - depositPct;
    const triggerLabel = trigger === 'delivered' ? 'dodání' : 'objednávky';
    const label = hasDeposit
      ? `Doplatek ${balancePct}% · Splatnost ${netDays ?? 0} d od ${triggerLabel}`
      : `Celkem · Splatnost ${netDays ?? 0} d od ${triggerLabel}`;
    payments.push({
      label,
      amount: balanceAmount > 0 ? balanceAmount : totalCZK,
      dueDate: due,
      triggered,
      kind: hasDeposit ? 'balance' : 'total',
      basis: triggerBasis === 'none' ? 'none' : triggerBasis,
    });
  }
  return payments;
}

// ==========================================================================
// Main App
// ==========================================================================

export default function CashFlowPlanner() {
  const [data, setData] = useState({
    projects: [makeStockProject()], activeProjectId: null,
    categories: DEFAULT_CATEGORIES, suppliers: [], catalog: [],
    locations: DEFAULT_LOCATIONS,
    stockItems: [],       // skladové kusy
    stockMovements: [],   // historie pohybů
    paymentPlanTemplates: [],  // šablony platebních plánů
    pdfAttachments: [],   // metadata k importovaným PDF (binární data v IndexedDB)
    settings: {
      fxRate: 25,
      expenseVatRate: 21, // DPH na nákupy materiálu/služeb (přidává se do cash flow)
      anthropicApiKey: '', // Klíč pro Claude API (import PDF faktur/objednávek)
      anthropicModel: 'claude-sonnet-4-5', // Model pro parsování PDF
    },
  });
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [view, setView] = useState('dashboard');

  useEffect(() => {
    (async () => {
      // Try v8 first; fall back to v7 with auto-migration.
      // Each storage.get is wrapped in its own try because missing keys THROW (not return null).
      let parsed = null;
      let migratedFromV7 = false;

      try {
        const result = await window.storage.get(STORAGE_KEY);
        if (result && result.value) {
          parsed = JSON.parse(result.value);
        }
      } catch (e) {
        // v9 key doesn't exist yet — that's expected on first run
      }

      // If v9 not found or empty, check v8 (current data shape, just different key)
      const v9IsEmpty = parsed && (!parsed.projects || parsed.projects.length === 0);
      if (!parsed || v9IsEmpty) {
        try {
          const v8 = await window.storage.get('fve-planner-data-v8');
          if (v8 && v8.value) {
            const v8parsed = JSON.parse(v8.value);
            if (v8parsed.projects && v8parsed.projects.length > 0) {
              parsed = v8parsed;
              console.log('[Cash Flow Planner] Loaded data from v8.');
            }
          }
        } catch (e) {}
      }

      // Final fallback: v7 with full migration
      const stillEmpty = parsed && (!parsed.projects || parsed.projects.length === 0);
      if (!parsed || stillEmpty) {
        try {
          const v7 = await window.storage.get('fve-planner-data-v7');
          if (v7 && v7.value) {
            const v7parsed = JSON.parse(v7.value);
            if (v7parsed.projects && v7parsed.projects.length > 0) {
              parsed = v7parsed;
              migratedFromV7 = true;
            }
          }
        } catch (e) {
          // v7 key doesn't exist either — fresh install
        }
      }

      if (parsed) {
        try {
          let migratedProjects = parsed.projects || [];
          let migratedSettings = parsed.settings || null;

          if (migratedFromV7) {
            // Pick the FX rate: use the first project's rate if present, else 25
            const firstRate = migratedProjects.find(p => p.exchangeRate != null)?.exchangeRate;
            migratedSettings = { fxRate: parseFloat(firstRate) || 25 };
            // Strip exchangeRate from every project (it's now global)
            migratedProjects = migratedProjects.map(p => {
              const { exchangeRate, ...rest } = p;
              return rest;
            });
            console.log(`[Cash Flow Planner] Migrated v7 → v9. Global FX rate set to ${migratedSettings.fxRate}. Projekty: ${migratedProjects.length}.`);
          }

          // Defensive shape normalization — make sure every project has the fields the UI expects
          migratedProjects = migratedProjects.map(p => ({
            ...p,
            status: p.status === 'completed' ? 'completed' : 'active',
            items: (Array.isArray(p.items) ? p.items : []).map(item => {
              // Migrace položek: status='invoiced' se rozpadne na status='delivered' + isInvoiced=true.
              // Staré položky bez isInvoiced pole se nastaví na false.
              const oldStatus = item.status || 'planned';
              let newStatus = oldStatus;
              let isInvoiced = item.isInvoiced;
              if (oldStatus === 'invoiced') {
                newStatus = 'delivered';
                if (isInvoiced === undefined) isInvoiced = true;
              } else if (isInvoiced === undefined) {
                isInvoiced = false;
              }
              return { ...item, status: newStatus, isInvoiced };
            }),
            budgets: p.budgets && typeof p.budgets === 'object' ? p.budgets : {},
          }));

          // Zajistit, že existuje virtuální projekt "Sklad" pro nákupy bez konkrétního projektu
          if (!migratedProjects.find(p => p.id === STOCK_PROJECT_ID || p.isStockProject)) {
            migratedProjects = [makeStockProject(), ...migratedProjects];
          }

          setData({
            projects: migratedProjects,
            activeProjectId: parsed.activeProjectId || null,
            categories: parsed.categories?.length ? parsed.categories : DEFAULT_CATEGORIES,
            suppliers: parsed.suppliers || [],
            catalog: parsed.catalog || [],
            locations: (() => {
              const loaded = parsed.locations?.length ? parsed.locations : DEFAULT_LOCATIONS;
              // Zajistit systémovou lokaci "Na cestě"
              if (!loaded.some(l => l.id === TRANSIT_LOCATION_ID)) {
                return [...loaded, DEFAULT_LOCATIONS.find(l => l.id === TRANSIT_LOCATION_ID)];
              }
              return loaded;
            })(),
            stockItems: parsed.stockItems || [],
            stockMovements: (() => {
              const rawMovements = parsed.stockMovements || [];
              const stockLookup = new Map((parsed.stockItems || []).map(s => [s.id, s]));
              // Migrace: staré pohyby (hlavně z bulkConsume) neměly itemName, quantity, projectId.
              // Použít toProjectId → projectId, doplnit itemName ze stockLookup.
              return rawMovements.map(m => {
                const patch = {};
                if (!m.itemName && m.stockItemId) {
                  const stk = stockLookup.get(m.stockItemId);
                  if (stk) {
                    patch.itemName = stk.name;
                    if (!m.serialNumber) patch.serialNumber = stk.serialNumber || '';
                    if (!m.quantity) patch.quantity = parseInt(stk.batchQuantity, 10) || 1;
                  }
                }
                // Sjednotit toProjectId → projectId (starý bulk consume používal toProjectId)
                if (!m.projectId && m.toProjectId) patch.projectId = m.toProjectId;
                return Object.keys(patch).length ? { ...m, ...patch } : m;
              });
            })(),
            paymentPlanTemplates: parsed.paymentPlanTemplates || [],
            pdfAttachments: parsed.pdfAttachments || [],
            settings: {
              fxRate: migratedSettings?.fxRate ?? 25,
              expenseVatRate: migratedSettings?.expenseVatRate ?? 21,
              anthropicApiKey: migratedSettings?.anthropicApiKey ?? '',
              anthropicModel: migratedSettings?.anthropicModel ?? 'claude-sonnet-4-5',
            },
          });
        } catch (e) {
          console.error('[Cash Flow Planner] Failed to apply loaded data:', e);
        }
      }

      // Set loading = false LAST, so the save effect doesn't write the empty initial state before we've loaded.
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (loading) return;
    (async () => {
      try { await window.storage.set(STORAGE_KEY, JSON.stringify(data)); } catch (e) { console.error(e); }
    })();
  }, [data, loading]);

  const activeProject = data.projects.find(p => p.id === data.activeProjectId);
  const fxRate = data.settings?.fxRate ?? 25;
  const [focusKey, setFocusKey] = useState(null); // { projectId, itemId, ts } for scroll/highlight hints

  // Login odstraněn — vždy běží jako admin (jednouživatelská aplikace)
  const authUser = { id: 'default', name: 'User', email: '', role: 'admin' };
  const readOnly = false;

  const createProject = ({ name, client, power, contractValue, vatRate }) => {
    const newProject = {
      id: uid('proj'), name, client, power,
      contractValue: parseFloat(contractValue) || 0,
      vatRate: parseFloat(vatRate) || 0,
      status: 'active', // 'active' | 'completed'
      createdAt: new Date().toISOString(),
      budgets: data.categories.reduce((acc, c) => ({ ...acc, [c.id]: 0 }), {}),
      items: [],
    };
    setData(d => ({ ...d, projects: [...d.projects, newProject], activeProjectId: newProject.id }));
  };

  const updateProjectMeta = (id, patch) =>
    setData(d => ({ ...d, projects: d.projects.map(p => p.id === id ? { ...p, ...patch } : p) }));

  const deleteProject = (id) => {
    setData(d => {
      // Sklad nesmí být smazán
      const target = d.projects.find(p => p.id === id);
      if (target?.isStockProject) {
        alert('Projekt „Sklad" nelze smazat — je to systémový projekt pro nákupy bez konkrétní zakázky.');
        return d;
      }
      const remaining = d.projects.filter(p => p.id !== id);
      return {
        ...d, projects: remaining,
        activeProjectId: d.activeProjectId === id ? (remaining[0]?.id ?? null) : d.activeProjectId,
      };
    });
  };

  const updateActive = (updater) =>
    setData(d => ({ ...d, projects: d.projects.map(p => p.id === d.activeProjectId ? updater(p) : p) }));

  const saveItem = (item, editingId) => {
    updateActive(p => {
      const items = editingId
        ? p.items.map(i => i.id === editingId ? { ...item, id: editingId } : i)
        : [...p.items, { ...item, id: uid('item'), status: item.status || 'planned' }];
      return { ...p, items };
    });
  };

  const deleteItem = (id) => updateActive(p => ({ ...p, items: p.items.filter(i => i.id !== id) }));

  // ===== Klientské platby =====
  // Platby jsou součástí projektu (project.clientPayments: array)
  // { id, dueDate, amount, currency, status: 'planned'|'invoiced'|'paid', invoicedDate, paidDate, label, notes }
  const addClientPayment = (projectId, payment) => {
    setData(d => ({
      ...d,
      projects: d.projects.map(p => p.id === projectId
        ? { ...p, clientPayments: [...(p.clientPayments || []), { ...payment, id: payment.id || uid('cpay') }] }
        : p),
    }));
  };
  const updateClientPayment = (projectId, paymentId, patch) => {
    setData(d => ({
      ...d,
      projects: d.projects.map(p => p.id === projectId
        ? { ...p, clientPayments: (p.clientPayments || []).map(cp => cp.id === paymentId ? { ...cp, ...patch } : cp) }
        : p),
    }));
  };
  const deleteClientPayment = (projectId, paymentId) => {
    setData(d => ({
      ...d,
      projects: d.projects.map(p => p.id === projectId
        ? { ...p, clientPayments: (p.clientPayments || []).filter(cp => cp.id !== paymentId) }
        : p),
    }));
  };

  // Aplikovat platební šablonu na projekt
  // generatedPayments: array bez id (přidá se zde)
  // replaceExisting: pokud true, smaže stávající platby
  const applyPaymentTemplateToProject = (projectId, generatedPayments, replaceExisting) => {
    const withIds = generatedPayments.map(p => ({ ...p, id: uid('cpay') }));
    setData(d => ({
      ...d,
      projects: d.projects.map(p => p.id === projectId
        ? { ...p, clientPayments: replaceExisting ? withIds : [...(p.clientPayments || []), ...withIds] }
        : p),
    }));
  };

  // Spravovat šablony platebních plánů
  const savePaymentPlanTemplates = (templates) => {
    setData(d => ({ ...d, paymentPlanTemplates: templates }));
  };

  // Smazat PDF přílohu (z IndexedDB i z metadat + odstranit odkaz z položek)
  const deletePdfAttachment = async (attachmentId) => {
    try {
      await deletePdfFromDb(attachmentId);
    } catch (e) {
      console.error('Nepodařilo se smazat PDF z IndexedDB:', e);
    }
    setData(d => ({
      ...d,
      pdfAttachments: (d.pdfAttachments || []).filter(a => a.id !== attachmentId),
      projects: d.projects.map(p => ({
        ...p,
        items: (p.items || []).map(i =>
          i.pdfAttachmentId === attachmentId ? { ...i, pdfAttachmentId: null } : i
        ),
      })),
    }));
  };

  // Přidat PDF přímo k projektu (bez vazby na položku/objednávku)
  const addPdfToProject = async (projectId, file) => {
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      const id = uid('pdf');
      await savePdfToDb(id, file.name, base64);
      setData(d => ({
        ...d,
        pdfAttachments: [...(d.pdfAttachments || []), {
          id,
          filename: file.name,
          importedAt: new Date().toISOString(),
          projectId,
          orderNumber: '',
          supplierName: '',
          itemCount: 0,
          manuallyAdded: true, // příznak: uživatel ho ručně přidal, není z importu
        }],
      }));
    } catch (e) {
      console.error(e);
      alert('Nepodařilo se přidat PDF: ' + (e.message || e));
    }
  };

  const updateItemGlobal = (projectId, itemId, patch) => {
    setData(d => ({
      ...d, projects: d.projects.map(p => p.id === projectId
        ? { ...p, items: p.items.map(i => i.id === itemId ? { ...i, ...patch } : i) } : p),
    }));
  };

  const updateItemsBatch = (updates) => {
    setData(d => {
      const map = new Map();
      updates.forEach(u => {
        if (!map.has(u.projectId)) map.set(u.projectId, new Map());
        map.get(u.projectId).set(u.itemId, u.patch);
      });
      return {
        ...d, projects: d.projects.map(p => {
          if (!map.has(p.id)) return p;
          const patches = map.get(p.id);
          return { ...p, items: p.items.map(i => patches.has(i.id) ? { ...i, ...patches.get(i.id) } : i) };
        }),
      };
    });
  };

  const saveBudgets = (budgets) => updateActive(p => ({ ...p, budgets }));
  const saveCategories = (categories) => {
    setData(d => ({
      ...d, categories,
      projects: d.projects.map(p => ({
        ...p, budgets: categories.reduce((acc, c) => ({ ...acc, [c.id]: p.budgets[c.id] || 0 }), {}),
      })),
    }));
  };
  const saveSuppliers = (suppliers) => {
    setData(d => {
      const keptIds = new Set(suppliers.map(s => s.id));
      return { ...d, suppliers, catalog: d.catalog.filter(c => keptIds.has(c.supplierId)) };
    });
  };
  const saveCatalog = (catalog) => setData(d => ({ ...d, catalog }));
  const saveSettings = (settings) => setData(d => ({ ...d, settings: { ...d.settings, ...settings } }));

  // ===== Skladové operace =====
  const saveLocations = (locations) => {
    // Nelze smazat lokace, na kterých jsou kusy
    setData(d => {
      const usedLocIds = new Set(d.stockItems.map(s => s.locationId));
      const filtered = locations.filter(l => l.id === 'loc_warehouse' || !usedLocIds.has(l.id) || locations.some(ll => ll.id === l.id));
      // Pokud uživatel pokusil smazat hlavní sklad, vrátit ho zpět
      if (!filtered.some(l => l.id === 'loc_warehouse')) {
        filtered.unshift({ id: 'loc_warehouse', name: 'Hlavní sklad', type: 'warehouse', notes: '' });
      }
      // Zachovat systémovou "Na cestě"
      if (!filtered.some(l => l.id === TRANSIT_LOCATION_ID)) {
        const existing = d.locations.find(l => l.id === TRANSIT_LOCATION_ID);
        filtered.push(existing || DEFAULT_LOCATIONS.find(l => l.id === TRANSIT_LOCATION_ID));
      }
      return { ...d, locations: filtered };
    });
  };

  // Přidat skladový kus (naskladnění z objednávky nebo manuálně)
  const addStockItem = (stockItem, movementNotes = '') => {
    const newItem = { ...stockItem, id: stockItem.id || uid('stk') };
    const movement = {
      id: uid('mov'),
      date: stockItem.receivedDate || todayISO(),
      type: 'receive',
      stockItemId: newItem.id,
      itemName: newItem.name,
      serialNumber: newItem.serialNumber || '',
      quantity: 1,
      fromLocationId: null,
      toLocationId: newItem.locationId,
      projectId: null,
      notes: movementNotes,
      createdAt: new Date().toISOString(),
    };
    setData(d => ({
      ...d,
      stockItems: [...d.stockItems, newItem],
      stockMovements: [...d.stockMovements, movement],
    }));
  };

  // Aktualizovat skladový kus (např. změna záruky, ceny, poznámky)
  const updateStockItem = (id, patch) => {
    setData(d => ({
      ...d,
      stockItems: d.stockItems.map(s => s.id === id ? { ...s, ...patch } : s),
    }));
  };

  // Přesun kusu na jinou lokaci (vytvoří pohyb)
  const transferStockItem = (id, toLocationId, notes = '') => {
    setData(d => {
      const item = d.stockItems.find(s => s.id === id);
      if (!item) return d;
      const fromLocationId = item.locationId;
      const movement = {
        id: uid('mov'),
        date: todayISO(),
        type: 'transfer',
        stockItemId: id,
        itemName: item.name,
        serialNumber: item.serialNumber || '',
        quantity: 1,
        fromLocationId,
        toLocationId,
        projectId: null,
        notes,
        createdAt: new Date().toISOString(),
      };
      return {
        ...d,
        stockItems: d.stockItems.map(s => s.id === id ? { ...s, locationId: toLocationId } : s),
        stockMovements: [...d.stockMovements, movement],
      };
    });
  };

  // Spotřeba kusu na projekt (odepsání ze skladu)
  const consumeStockItem = (id, projectId, notes = '') => {
    setData(d => {
      const item = d.stockItems.find(s => s.id === id);
      if (!item) return d;
      const movement = {
        id: uid('mov'),
        date: todayISO(),
        type: 'consume',
        stockItemId: id,
        itemName: item.name,
        serialNumber: item.serialNumber || '',
        quantity: parseInt(item.batchQuantity, 10) || 1,
        amountCZK: parseFloat(item.purchasePriceCZK) || 0,
        fromLocationId: item.locationId,
        toLocationId: null,
        projectId,
        notes,
        createdAt: new Date().toISOString(),
      };

      // Zkontrolovat, jestli zdrojová objednávka už NEEXISTUJE v cílovém projektu.
      // Pokud existuje (což je nejčastější případ — položka se v projektu objednala, dodala, naskladnila
      // a nyní se z něj i spotřebovává), NEVYTVÁŘÍME kopii — jinak by došlo k duplicitě nákladů.
      const targetProject = d.projects.find(p => p.id === projectId);
      const originalItemExists = item.sourceOrderItemId && targetProject?.items?.some(i => i.id === item.sourceOrderItemId);

      let updatedProjects = d.projects;
      if (!originalItemExists) {
        // Vytvořit projektovou položku v cílovém projektu (typicky při přesunu ze Skladu na jiný projekt).
        const qty = parseInt(item.batchQuantity, 10) || 1;
        const priceCZK = parseFloat(item.purchasePriceCZK) || 0;
        const unitPrice = qty > 0 ? priceCZK / qty : priceCZK;
        const propagatedItem = {
          id: uid('item'),
          name: item.name,
          category: item.category || '',
          quantity: qty,
          unit: 'ks',
          unitPrice,
          currency: 'CZK', // purchasePriceCZK je již v CZK
          supplierId: item.supplierId || '',
          supplier: item.supplierId ? '' : (item.supplierName || ''),
          orderNumber: item.orderNumber || '',
          purchaseDate: item.receivedDate || todayISO(),
          deliveredDate: item.receivedDate || todayISO(),
          paymentDueDate: '',
          notes: `Ze skladu · ${item.serialNumber ? `S/N ${item.serialNumber}` : `naskladněno ${item.receivedDate || ''}`}${notes ? ` · ${notes}` : ''}`,
          status: 'delivered',
          isInvoiced: true, // materiál už byl kdysi zaplacen
          invoicedDate: item.receivedDate || todayISO(),
          fromStockItemId: item.id, // odkaz zpět na kus ve skladu
        };
        updatedProjects = d.projects.map(p =>
          p.id === projectId ? { ...p, items: [...(p.items || []), propagatedItem] } : p
        );
      }

      return {
        ...d,
        projects: updatedProjects,
        stockItems: d.stockItems.map(s => s.id === id ? { ...s, consumedDate: todayISO(), consumedToProjectId: projectId, status: 'consumed' } : s),
        stockMovements: [...d.stockMovements, movement],
      };
    });
  };

  // Smazat skladový kus (pouze pokud nemá historii nebo s confirm)
  const deleteStockItem = (id) => {
    setData(d => {
      const item = d.stockItems.find(s => s.id === id);
      if (!item) return d;
      // Zapsat mazací pohyb pro audit trail — historie stavu ke dni musí sedět
      const movement = {
        id: uid('mov'),
        date: todayISO(),
        type: 'delete',
        stockItemId: id,
        itemName: item.name,
        serialNumber: item.serialNumber || '',
        quantity: parseInt(item.batchQuantity, 10) || 1,
        fromLocationId: item.locationId,
        toLocationId: null,
        notes: 'Kus smazán ze skladu',
        createdAt: new Date().toISOString(),
      };
      return {
        ...d,
        stockItems: d.stockItems.filter(s => s.id !== id),
        stockMovements: [...d.stockMovements, movement],
      };
    });
  };

  // Bulk transfer - přesun více kusů najednou
  const bulkTransferStock = (items, toLocationId, notes) => {
    setData(d => {
      const today = todayISO();
      const movements = items.filter(it => it.locationId !== toLocationId).map(it => ({
        id: uid('mov'),
        date: today,
        type: 'transfer',
        stockItemId: it.id,
        itemName: it.name,
        serialNumber: it.serialNumber || '',
        quantity: parseInt(it.batchQuantity, 10) || 1,
        amountCZK: parseFloat(it.purchasePriceCZK) || 0,
        fromLocationId: it.locationId,
        toLocationId,
        notes: notes || '',
        createdAt: new Date().toISOString(),
      }));
      const ids = new Set(items.map(it => it.id));
      return {
        ...d,
        stockItems: d.stockItems.map(s => ids.has(s.id) ? { ...s, locationId: toLocationId } : s),
        stockMovements: [...d.stockMovements, ...movements],
      };
    });
  };

  // Bulk consume - spotřeba více kusů najednou na projekt
  const bulkConsumeStock = (items, projectId, notes) => {
    setData(d => {
      const today = todayISO();
      const consumable = items.filter(it => it.status !== 'consumed');
      const movements = consumable.map(it => ({
        id: uid('mov'),
        date: today,
        type: 'consume',
        stockItemId: it.id,
        itemName: it.name,
        serialNumber: it.serialNumber || '',
        quantity: parseInt(it.batchQuantity, 10) || 1,
        amountCZK: parseFloat(it.purchasePriceCZK) || 0,
        fromLocationId: it.locationId,
        toLocationId: null,
        projectId,
        notes: notes || '',
        createdAt: new Date().toISOString(),
      }));
      const ids = new Set(items.map(it => it.id));

      // Zkontrolovat, které kusy je potřeba propagovat: pouze ty, jejichž zdrojová objednávka
      // NENÍ v cílovém projektu (jinak vzniká duplicita nákladů).
      const targetProject = d.projects.find(p => p.id === projectId);
      const existingItemIds = new Set((targetProject?.items || []).map(i => i.id));

      // Propagovat pouze kusy, které přinesou novou položku (bez duplikace)
      const propagatedItems = consumable
        .filter(it => !(it.sourceOrderItemId && existingItemIds.has(it.sourceOrderItemId)))
        .map(it => {
          const qty = parseInt(it.batchQuantity, 10) || 1;
          const priceCZK = parseFloat(it.purchasePriceCZK) || 0;
          const unitPrice = qty > 0 ? priceCZK / qty : priceCZK;
          return {
            id: uid('item'),
            name: it.name,
            category: it.category || '',
            quantity: qty,
            unit: 'ks',
            unitPrice,
            currency: 'CZK',
            supplierId: it.supplierId || '',
            supplier: it.supplierId ? '' : (it.supplierName || ''),
            orderNumber: it.orderNumber || '',
            purchaseDate: it.receivedDate || today,
            deliveredDate: it.receivedDate || today,
            paymentDueDate: '',
            notes: `Ze skladu · ${it.serialNumber ? `S/N ${it.serialNumber}` : `naskladněno ${it.receivedDate || ''}`}${notes ? ` · ${notes}` : ''}`,
            status: 'delivered',
            isInvoiced: true,
            invoicedDate: it.receivedDate || today,
            fromStockItemId: it.id,
          };
        });

      const updatedProjects = d.projects.map(p =>
        p.id === projectId ? { ...p, items: [...(p.items || []), ...propagatedItems] } : p
      );

      return {
        ...d,
        projects: updatedProjects,
        stockItems: d.stockItems.map(s => ids.has(s.id) && s.status !== 'consumed' ? {
          ...s,
          consumedDate: today,
          consumedToProjectId: projectId,
          status: 'consumed',
        } : s),
        stockMovements: [...d.stockMovements, ...movements],
      };
    });
  };

  const importCSV = (items) => {
    updateActive(p => ({
      ...p, items: [...p.items, ...items.map(i => ({ ...i, id: uid('item'), status: i.status || 'planned' }))],
    }));
  };

  // Import objednávky: aplikuje patches na existující položky + vytvoří nové
  const importOrderResult = (result) => {
    setData(d => {
      let updatedProjects = d.projects.map(p => ({ ...p, items: [...p.items] }));

      // 1) Patches - aktualizovat existující položky
      (result.patches || []).forEach(({ projectId, itemId, patch }) => {
        const proj = updatedProjects.find(p => p.id === projectId);
        if (proj) {
          proj.items = proj.items.map(it => it.id === itemId ? { ...it, ...patch } : it);
        }
      });

      // 2) Nové položky - vytvořit v cílových projektech
      (result.newItems || []).forEach(({ projectId, item }) => {
        const proj = updatedProjects.find(p => p.id === projectId);
        if (proj) {
          proj.items = [...proj.items, item];
        }
      });

      return { ...d, projects: updatedProjects };
    });
  };

  // Import z PDF (AI) — nové položky se přidají do zvoleného projektu jako "objednané"
  const importPdfResult = (result) => {
    const { projectId, supplierId, supplierFreeText, orderNumber, issueDate, dueDate, currency, items, attachment, mode, matches } = result;

    // Režim "attach" — přehrát existující položky objednávky daty z faktury
    if (mode === 'attach' && Array.isArray(matches)) {
      setData(d => {
        const updatedProjects = d.projects.map(p => {
          const projItems = [...(p.items || [])];
          // Zpracovat každé páry (matchedItemId → aiItem)
          matches.forEach(m => {
            if (m.action === 'overwrite' && m.orderItemId) {
              const idx = projItems.findIndex(x => x.id === m.orderItemId);
              if (idx >= 0) {
                projItems[idx] = {
                  ...projItems[idx],
                  quantity: parseFloat(m.aiItem.quantity) || projItems[idx].quantity,
                  unitPrice: parseFloat(m.aiItem.unitPrice) || projItems[idx].unitPrice,
                  currency: currency || projItems[idx].currency,
                  isInvoiced: true,
                  invoicedDate: issueDate || todayISO(),
                  paymentDueDate: dueDate || projItems[idx].paymentDueDate,
                  pdfAttachmentId: attachment?.id || projItems[idx].pdfAttachmentId,
                };
              }
            } else if (m.action === 'add' && p.id === projectId) {
              // Nová položka z faktury, která nebyla v původní objednávce
              projItems.push({
                id: uid('item'),
                name: m.aiItem.name.trim(),
                category: m.aiItem.category || '',
                quantity: parseFloat(m.aiItem.quantity) || 0,
                unit: m.aiItem.unit || 'ks',
                unitPrice: parseFloat(m.aiItem.unitPrice) || 0,
                currency: currency || 'CZK',
                supplierId: supplierId || '',
                supplier: supplierId ? '' : (supplierFreeText || ''),
                orderNumber: orderNumber || '',
                purchaseDate: issueDate || todayISO(),
                deliveredDate: '',
                paymentDueDate: dueDate || '',
                notes: m.aiItem.notes || '',
                status: 'ordered',
                isInvoiced: true,
                invoicedDate: issueDate || todayISO(),
                pdfAttachmentId: attachment?.id || null,
              });
            }
          });
          return { ...p, items: projItems };
        });

        const overwrittenCount = matches.filter(m => m.action === 'overwrite').length;
        const addedCount = matches.filter(m => m.action === 'add').length;

        const updatedAttachments = attachment
          ? [...(d.pdfAttachments || []), {
              id: attachment.id,
              filename: attachment.filename,
              importedAt: attachment.importedAt,
              projectId,
              orderNumber: attachment.orderNumber,
              supplierName: attachment.supplierName,
              itemCount: overwrittenCount + addedCount,
            }]
          : (d.pdfAttachments || []);

        return { ...d, projects: updatedProjects, pdfAttachments: updatedAttachments };
      });
      return;
    }

    // Standardní režim "create" — vytvořit nové položky
    setData(d => {
      const newItems = items.map(it => ({
        id: uid('item'),
        name: it.name.trim(),
        category: it.category || '',
        quantity: parseFloat(it.quantity) || 0,
        unit: it.unit || 'ks',
        unitPrice: parseFloat(it.unitPrice) || 0,
        currency: currency || 'CZK',
        supplierId: supplierId || '',
        supplier: supplierId ? '' : (supplierFreeText || ''),
        orderNumber: orderNumber || '',
        purchaseDate: issueDate || todayISO(),
        deliveredDate: '',
        paymentDueDate: dueDate || '',
        notes: it.notes || '',
        status: 'ordered', // Po importu je položka již objednaná
        pdfAttachmentId: attachment?.id || null, // odkaz na PDF
      }));

      const updatedProjects = d.projects.map(p =>
        p.id === projectId ? { ...p, items: [...(p.items || []), ...newItems] } : p
      );

      const updatedAttachments = attachment
        ? [...(d.pdfAttachments || []), {
            id: attachment.id,
            filename: attachment.filename,
            importedAt: attachment.importedAt,
            projectId,
            orderNumber: attachment.orderNumber,
            supplierName: attachment.supplierName,
            itemCount: newItems.length,
          }]
        : (d.pdfAttachments || []);

      return { ...d, projects: updatedProjects, pdfAttachments: updatedAttachments };
    });
  };

  // Pokud aktuální view není pro roli dostupná, přepnout na první dostupnou
  // POZN: useEffect MUSÍ být před všemi early returns (Rules of Hooks)
  useEffect(() => {
    if (!authUser) return;
    if (!canAccessView(authUser.role, view)) {
      const firstAllowed = (ROLE_VIEWS[authUser.role] || ROLE_VIEWS.editor)[0] || 'dashboard';
      setView(firstAllowed);
    }
  }, [authUser, view]);

  if (loading) {
    return (
      <div style={styles.loadingScreen}>
        <img src={LOGO_DATA_URL} alt="Cash Flow Planner" width="80" height="80" style={{ borderRadius: 12, animation: 'spin 2s linear infinite' }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const hasProjects = data.projects.length > 0;

  return (
    <div style={styles.app}>
      <style>{globalCSS}</style>

      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logo}>
            <img src={LOGO_DATA_URL} alt="Cash Flow Planner" width="44" height="44" style={{ borderRadius: 10, display: 'block' }} />
          </div>
          <div>
            <h1 style={styles.title}>
              <span style={{ color: '#c4ff3d' }}>Cash Flow</span> <span style={{ color: '#fff' }}>Planner</span>
            </h1>
            <p style={styles.subtitle}>
              Příjmy · Výdaje · Plánování cash flow
              <span style={{ marginLeft: 10, padding: '1px 7px', fontSize: 10, fontWeight: 600, background: 'rgba(196, 255, 61, 0.18)', color: '#c4ff3d', borderRadius: 4, letterSpacing: '0.04em', verticalAlign: 1 }}>
                v{APP_VERSION}
              </span>
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {canAccessView(authUser.role, 'dashboard') && (
            <NavButton active={view === 'dashboard'} onClick={() => { setFocusKey(null); setView('dashboard'); }} icon={<LayoutDashboard size={15} />}>Přehled</NavButton>
          )}
          {canAccessView(authUser.role, 'projects') && (
            <NavButton active={view === 'project'} onClick={() => { setFocusKey(null); setView('project'); }} icon={<Package size={15} />}>Projekty</NavButton>
          )}
          {canAccessView(authUser.role, 'purchaseList') && (
            <NavButton active={view === 'purchaseList'} onClick={() => { setFocusKey(null); setView('purchaseList'); }} icon={<ShoppingCart size={15} />}>Nákupní seznam</NavButton>
          )}
          {canAccessView(authUser.role, 'orders') && (
            <NavButton active={view === 'orders'} onClick={() => { setFocusKey(null); setView('orders'); }} icon={<ListChecks size={15} />}>Objednávky</NavButton>
          )}
          {canAccessView(authUser.role, 'stock') && (
            <NavButton active={view === 'stock'} onClick={() => { setFocusKey(null); setView('stock'); }} icon={<Warehouse size={15} />}>Sklad ({data.stockItems.filter(s => s.status !== 'consumed').length})</NavButton>
          )}
          {canAccessView(authUser.role, 'cashflow') && (
            <NavButton active={view === 'cashflow'} onClick={() => { setFocusKey(null); setView('cashflow'); }} icon={<Calendar size={15} />}>Cash flow</NavButton>
          )}
          {/* Katalog a Dodavatelé dostupní pro všechny role kromě Management (jen čtení) — Management je má přes ne-readOnly modal */}
          <button style={styles.secondaryBtnDark} onClick={() => setModal({ type: 'catalog' })}>
            <BookOpen size={15} /> Katalog ({data.catalog.length})
          </button>
          <button style={styles.secondaryBtnDark} onClick={() => setModal({ type: 'suppliers' })}>
            <Users size={15} /> Dodavatelé ({data.suppliers.length})
          </button>
          {canAccessSettings(authUser.role) && (
            <button style={styles.secondaryBtnDark} onClick={() => setModal({ type: 'settings' })}>
              <Settings size={15} /> Nastavení
            </button>
          )}
          {/* Nový projekt — jen pro role které mohou editovat (admin/finance/editor) */}
          {canEdit(authUser.role) && (
            <button style={styles.primaryBtn} onClick={() => setModal({ type: 'project' })}>
              <FolderPlus size={15} /> Nový projekt
            </button>
          )}
        </div>
      </header>

      {!hasProjects && view !== 'dashboard' ? (
        <EmptyState onCreate={() => setModal({ type: 'project' })} />
      ) : view === 'dashboard' ? (
        <DashboardView
          projects={data.projects}
          categories={data.categories}
          suppliers={data.suppliers}
          stockItems={data.stockItems}
          locations={data.locations}
          fxRate={fxRate}
          settings={data.settings}
          readOnly={readOnly}
          onGoToProject={(id) => { setData(d => ({ ...d, activeProjectId: id })); setView('project'); }}
          onGoToPurchaseList={() => setView('purchaseList')}
          onGoToOrders={() => setView('orders')}
          onGoToCashflow={() => setView('cashflow')}
          onGoToStock={() => setView('stock')}
          onCreateProject={() => setModal({ type: 'project' })}
          onOpenItem={(projectId, itemId) => {
            const proj = data.projects.find(p => p.id === projectId);
            const item = proj?.items.find(i => i.id === itemId);
            if (!item) return;
            const s = item.status || 'planned';
            // Nastavit focus pro zvýraznění v cílové sekci
            setFocusKey({ projectId, itemId, ts: Date.now() });
            // Planned → Nákupní seznam; cokoliv jiného → Objednávky
            if (s === 'planned') {
              setView('purchaseList');
            } else {
              setView('orders');
            }
          }}
        />
      ) : view === 'purchaseList' ? (
        <PurchaseListView
          projects={data.projects} categories={data.categories} suppliers={data.suppliers} fxRate={fxRate}
          focusKey={focusKey}
          onUpdateItem={updateItemGlobal} onBatchUpdate={updateItemsBatch}
          readOnly={readOnly}
        />
      ) : view === 'orders' ? (
        <OrdersView
          projects={data.projects} categories={data.categories} suppliers={data.suppliers} fxRate={fxRate}
          focusKey={focusKey}
          onUpdateItem={updateItemGlobal} onBatchUpdate={updateItemsBatch}
          readOnly={readOnly}
          onStockReceive={(orderItem) => setModal({ type: 'stockReceive', payload: orderItem })}
          onImportOrder={() => setModal({ type: 'importOrder' })}
          onImportPDF={() => setModal({ type: 'importPDF' })}
          onAttachInvoicePDF={(order) => setModal({ type: 'importPDF', targetOrder: order })}
          stockItems={data.stockItems}
          onGoToStock={(stockItemId, orderItemId) => {
            setView('stock');
            setFocusKey({ stockItemId, orderItemId, ts: Date.now() });
          }}
        />
      ) : view === 'stock' ? (
        <StockView
          stockItems={data.stockItems}
          stockMovements={data.stockMovements}
          locations={data.locations}
          categories={data.categories}
          projects={data.projects}
          suppliers={data.suppliers}
          fxRate={fxRate}
          readOnly={readOnly}
          focusKey={focusKey}
          onAddStock={() => setModal({ type: 'stockAdd' })}
          onEditStock={(stk) => setModal({ type: 'stockEdit', payload: stk })}
          onTransferStock={(stk) => setModal({ type: 'stockTransfer', payload: stk })}
          onConsumeStock={(stk) => setModal({ type: 'stockConsume', payload: stk })}
          onDeleteStock={deleteStockItem}
          onManageLocations={() => setModal({ type: 'settings', initialTab: 'locations' })}
          onBulkTransfer={bulkTransferStock}
          onBulkConsume={bulkConsumeStock}
          onGoToOrders={(orderNumber, itemId, projectId) => {
            if (projectId) {
              // Skok do projektu
              setData(d => ({ ...d, activeProjectId: projectId }));
              setView('projects');
              setFocusKey({ projectId, ts: Date.now() });
            } else {
              // Skok do objednávek
              setView('orders');
              setFocusKey({ orderNumber, itemId, ts: Date.now() });
            }
          }}
        />
      ) : view === 'cashflow' ? (
        <CashFlowView projects={data.projects} categories={data.categories} suppliers={data.suppliers} fxRate={fxRate} settings={data.settings} />
      ) : (
        <div style={styles.mainLayout}>
          <ProjectSidebar projects={data.projects} activeId={data.activeProjectId} fxRate={fxRate}
            onSelect={id => setData(d => ({ ...d, activeProjectId: id }))} onDelete={deleteProject}
            readOnly={readOnly} />
          {activeProject && (
            <ProjectView
              project={activeProject} categories={data.categories} suppliers={data.suppliers} fxRate={fxRate}
              settings={data.settings}
              readOnly={readOnly}
              pdfAttachments={data.pdfAttachments || []}
              onAddItem={() => setModal({ type: 'item' })}
              onEditItem={(item) => setModal({ type: 'item', payload: item })}
              onDeleteItem={deleteItem}
              onEditBudgets={() => setModal({ type: 'budgets' })}
              onEditMeta={() => setModal({ type: 'editProject', payload: activeProject })}
              onImport={() => setModal({ type: 'import' })}
              onManageSuppliers={() => setModal({ type: 'suppliers' })}
              onAddClientPayment={(payment) => addClientPayment(activeProject.id, payment)}
              onUpdateClientPayment={(paymentId, patch) => updateClientPayment(activeProject.id, paymentId, patch)}
              onDeleteClientPayment={(paymentId) => deleteClientPayment(activeProject.id, paymentId)}
              onApplyPaymentTemplate={(generated, replaceExisting) => applyPaymentTemplateToProject(activeProject.id, generated, replaceExisting)}
              paymentPlanTemplates={data.paymentPlanTemplates || []}
              onSetProjectStatus={(status) => {
                updateProjectMeta(activeProject.id, { status });
              }}
              onDeletePdfAttachment={deletePdfAttachment}
              onAddPdfToProject={(file) => addPdfToProject(activeProject.id, file)}
              onGoToPurchaseList={() => {
                setFocusKey({ filterProjectId: activeProject.id, ts: Date.now() });
                setView('purchaseList');
              }}
              onGoToOrders={() => {
                setFocusKey({ filterProjectId: activeProject.id, ts: Date.now() });
                setView('orders');
              }}
            />
          )}
        </div>
      )}

      {modal?.type === 'project' && (
        <ProjectModal
          onSave={(v) => { createProject(v); setModal(null); }}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === 'editProject' && (
        <ProjectModal
          project={modal.payload}
          onSave={(v) => { updateProjectMeta(modal.payload.id, v); setModal(null); }}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === 'item' && activeProject && (
        <ItemModal item={modal.payload} categories={data.categories} suppliers={data.suppliers} catalog={data.catalog}
          exchangeRate={fxRate}
          onSave={(item) => { saveItem(item, modal.payload?.id); setModal(null); }}
          onClose={() => setModal(null)}
          onOpenSuppliers={() => setModal({ type: 'suppliers' })}
          onOpenCatalog={() => setModal({ type: 'catalog' })} />
      )}
      {modal?.type === 'budgets' && activeProject && (
        <BudgetModal categories={data.categories} budgets={activeProject.budgets}
          onSave={(b) => { saveBudgets(b); setModal(null); }} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'settings' && (
        <SettingsModal
          settings={data.settings}
          categories={data.categories}
          locations={data.locations}
          paymentPlanTemplates={data.paymentPlanTemplates || []}
          role={authUser.role}
          fullData={data}
          initialTab={modal.initialTab}
          onSaveSettings={(s) => { saveSettings(s); /* stay in modal */ }}
          onSaveCategories={(c) => { saveCategories(c); /* stay in modal */ }}
          onSaveLocations={(l) => { saveLocations(l); /* stay in modal */ }}
          onSavePaymentPlanTemplates={(tpl) => { savePaymentPlanTemplates(tpl); /* stay in modal */ }}
          onDeletePdfAttachment={(id) => { deletePdfAttachment(id); }}
          onRestoreData={(newData) => { setData(newData); }}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === 'suppliers' && (
        <SupplierModal suppliers={data.suppliers}
          readOnly={readOnly}
          onSave={(s) => { saveSuppliers(s); setModal(null); }} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'catalog' && (
        <CatalogModal catalog={data.catalog} suppliers={data.suppliers}
          readOnly={readOnly}
          onSave={(c) => { saveCatalog(c); setModal(null); }}
          onClose={() => setModal(null)}
          onOpenSuppliers={() => setModal({ type: 'suppliers' })} />
      )}
      {modal?.type === 'stockAdd' && (
        <StockAddModal
          locations={data.locations}
          categories={data.categories}
          catalog={data.catalog}
          suppliers={data.suppliers}
          projects={data.projects}
          fxRate={fxRate}
          fromOrderItem={null}
          onSave={(stk, notes) => { addStockItem(stk, notes); setModal(null); }}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === 'stockReceive' && (
        <StockAddModal
          locations={data.locations}
          categories={data.categories}
          catalog={data.catalog}
          suppliers={data.suppliers}
          projects={data.projects}
          fxRate={fxRate}
          fromOrderItem={modal.payload}
          onSave={(stk, notes) => { addStockItem(stk, notes); setModal(null); }}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === 'stockEdit' && (
        <StockEditModal
          stockItem={modal.payload}
          locations={data.locations}
          categories={data.categories}
          onSave={(patch) => { updateStockItem(modal.payload.id, patch); setModal(null); }}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === 'stockTransfer' && (
        <StockTransferModal
          stockItem={modal.payload}
          locations={data.locations}
          onConfirm={(toLocId, notes) => { transferStockItem(modal.payload.id, toLocId, notes); setModal(null); }}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === 'stockConsume' && (
        <StockConsumeModal
          stockItem={modal.payload}
          projects={data.projects}
          onConfirm={(projectId, notes) => { consumeStockItem(modal.payload.id, projectId, notes); setModal(null); }}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === 'import' && activeProject && (
        <ImportModal categories={data.categories} suppliers={data.suppliers}
          onImport={(items) => { importCSV(items); setModal(null); }} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'importOrder' && (
        <ImportOrderModal
          projects={data.projects}
          categories={data.categories}
          suppliers={data.suppliers}
          fxRate={fxRate}
          onImport={(result) => { importOrderResult(result); setModal(null); }}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === 'importPDF' && (
        <PDFImportModal
          projects={data.projects}
          categories={data.categories}
          suppliers={data.suppliers}
          settings={data.settings}
          targetOrder={modal.targetOrder}
          onImport={(result) => { importPdfResult(result); setModal(null); }}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
function NavButton({ active, onClick, icon, children }) {
  return <button style={active ? styles.navBtnActive : styles.navBtn} onClick={onClick}>{icon} {children}</button>;
}

// ==========================================================================
// Dashboard
// ==========================================================================

function DashboardView({ projects, categories, suppliers, stockItems = [], locations = [], fxRate, settings, readOnly, onGoToProject, onGoToPurchaseList, onGoToOrders, onGoToCashflow, onGoToStock, onCreateProject, onOpenItem }) {
  const today = todayISO();

  // Outflows (supplier payments) — s DPH (matches Cash Flow)
  const dashExpenseVatRate = parseFloat(settings?.expenseVatRate) || 0;
  const dashVatMultiplier = 1 + dashExpenseVatRate / 100;
  const allPayments = useMemo(() => {
    const out = [];
    projects.forEach(p => {
      p.items.forEach(item => {
        // Vyfakturované položky jsou v saldu závazků jinde — vynecháváme je z přehledu závazků
        if (item.isInvoiced) return;

        const sup = suppliers.find(s => s.id === item.supplierId);
        const totalCZK = toCZK(item, fxRate);
        if (totalCZK <= 0) return;
        const payments = computePayments(item, sup, totalCZK);
        payments.forEach((pay, idx) => {
          out.push({
            type: 'outflow',
            projectId: p.id, projectName: p.name,
            itemId: item.id, itemName: item.name,
            supplierName: sup?.name || item.supplier || '(bez dodavatele)',
            status: item.status || 'planned',
            tranche: pay.kind, amount: pay.amount * dashVatMultiplier, // s DPH
            amountNet: pay.amount,
            dueDate: pay.dueDate, triggered: pay.triggered, trancheIndex: idx,
            basis: pay.basis,
          });
        });
      });
    });
    return out;
  }, [projects, suppliers, dashVatMultiplier]);

  // Buckets - jen výdaje
  const overdueOut = allPayments.filter(p => p.dueDate && p.dueDate < today);
  const due7Out = allPayments.filter(p => p.dueDate && p.dueDate >= today && daysBetween(p.dueDate, today) <= 7);
  const due30Out = allPayments.filter(p => p.dueDate && p.dueDate >= today && daysBetween(p.dueDate, today) <= 30);

  const sum = (arr) => arr.reduce((s, p) => s + p.amount, 0);

  const totalOpenOut = sum(allPayments);

  // ===== Příchozí platby od klientů =====
  // Plánováno/vyfakturováno (status 'paid' přeskakujeme — peníze už dorazily)
  const incomingPayments = useMemo(() => {
    const out = [];
    projects.forEach(p => {
      (p.clientPayments || []).forEach(cp => {
        if (cp.status === 'paid') return;
        const amount = parseFloat(cp.amount) || 0;
        if (amount === 0) return;
        const amountCZK = cp.currency === 'EUR' ? amount * fxRate : amount;
        out.push({
          paymentId: cp.id,
          projectId: p.id, projectName: p.name, projectClient: p.client || '',
          label: cp.label || '(bez popisu)',
          status: cp.status || 'planned',
          dueDate: cp.dueDate || '',
          amount: amountCZK,
        });
      });
    });
    return out;
  }, [projects, fxRate]);

  const overdueIn = incomingPayments.filter(p => p.dueDate && p.dueDate < today);
  const due7In = incomingPayments.filter(p => p.dueDate && p.dueDate >= today && daysBetween(p.dueDate, today) <= 7);
  const due30In = incomingPayments.filter(p => p.dueDate && p.dueDate >= today && daysBetween(p.dueDate, today) <= 30);

  // Příchozí platby pro dashboard karty
  const overdueIncoming = useMemo(() => {
    return incomingPayments
      .filter(p => p.dueDate && p.dueDate < today)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 8);
  }, [incomingPayments, today]);

  const dueSoonIncoming = useMemo(() => {
    return incomingPayments
      .filter(p => {
        if (!p.dueDate || p.dueDate < today) return false;
        return daysBetween(p.dueDate, today) <= 5;
      })
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 8);
  }, [incomingPayments, today]);

  // Upcoming items to order — položky v nákupním seznamu s blízkým plánovaným datem objednání
  const upcomingToOrder = useMemo(() => {
    const out = [];
    projects.forEach(p => {
      p.items.forEach(item => {
        if ((item.status || 'planned') !== 'planned') return; // jen ještě neobjednané
        const totalCZK = toCZK(item, fxRate);
        if (totalCZK <= 0) return;
        const sup = suppliers.find(s => s.id === item.supplierId);
        out.push({
          projectId: p.id, projectName: p.name,
          itemId: item.id, itemName: item.name,
          supplierName: sup?.name || item.supplier || '(bez dodavatele)',
          supplierMissing: !item.supplierId && !item.supplier,
          plannedOrderDate: item.plannedOrderDate || '',
          plannedDeliveryDate: item.plannedDeliveryDate || '',
          amount: totalCZK,
          quantity: item.quantity, unit: item.unit,
          notes: item.notes,
        });
      });
    });
    return out
      .filter(x => x.plannedOrderDate)
      .sort((a, b) => a.plannedOrderDate.localeCompare(b.plannedOrderDate));
  }, [projects, suppliers, fxRate]);

  // Položky bez plánovaného data objednání (pro info)
  const itemsWithoutOrderDate = useMemo(() => {
    let count = 0;
    projects.forEach(p => p.items.forEach(item => {
      if ((item.status || 'planned') === 'planned' && !item.plannedOrderDate) count++;
    }));
    return count;
  }, [projects]);

  const totalProjects = projects.length;
  const totalItems = projects.reduce((s, p) => s + p.items.length, 0);
  const totalPipeline = projects.reduce((s, p) => s + p.items.reduce((ss, i) => ss + toCZK(i, fxRate), 0), 0);

  const statusCounts = STATUSES.reduce((acc, s) => {
    acc[s.id] = projects.reduce((sum, p) => sum + p.items.filter(i => (i.status || 'planned') === s.id).length, 0);
    return acc;
  }, {});

  if (totalProjects === 0) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyIcon}><LayoutDashboard size={64} style={{ color: '#94a3b8' }} /></div>
        <h2 style={styles.emptyTitle}>Vítejte v přehledu</h2>
        <p style={styles.emptyText}>
          {readOnly
            ? 'Zatím zde nejsou žádné projekty. Až je administrátor přidá, uvidíte je zde.'
            : 'Vytvořte svůj první projekt a začněte sledovat příjmy, výdaje a cash flow.'}
        </p>
        {!readOnly && (
          <button style={styles.primaryBtn} onClick={onCreateProject}><FolderPlus size={16} /> Vytvořit první projekt</button>
        )}
      </div>
    );
  }

  return (
    <main style={styles.main}>
      <div style={styles.mainHeader}>
        <div>
          <h2 style={styles.projectTitle}>Přehled</h2>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>
            Income · Outflow · Action items
          </p>
        </div>
      </div>

      {/* Net position & totals */}
      <div style={styles.summaryGrid}>
        <SummaryCard label="Otevřené výdaje" value={fmt(totalOpenOut)} accent="#dc2626" icon={<ArrowUpCircle size={15} />} />
        <SummaryCard label="Celkové plánované náklady" value={fmt(totalPipeline)} accent="#0f172a" />
        {stockItems.filter(s => s.status !== 'consumed').length > 0 && (
          <>
            <SummaryCard
              label="Kusů na skladě"
              value={String(stockItems.filter(s => s.status !== 'consumed').length)}
              accent="#10b981"
              icon={<Warehouse size={15} />}
              onClick={onGoToStock}
            />
            <SummaryCard
              label="Hodnota skladu"
              value={fmt(stockItems.filter(s => s.status !== 'consumed').reduce((sum, s) => sum + (parseFloat(s.purchasePriceCZK) || 0), 0))}
              accent="#0d3825"
              onClick={onGoToStock}
            />
          </>
        )}
      </div>

      {/* Alert cards split into outflow / income */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 20 }}>
        <div style={styles.dashPanel}>
          <div style={{ ...styles.dashPanelHeader, color: '#dc2626' }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
              <ArrowUpCircle size={15} /> Outflows
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
            <MiniAlert color="#dc2626" label="Po splatnosti" amount={sum(overdueOut)} count={overdueOut.length} urgent={overdueOut.length > 0} onClick={onGoToPurchaseList} />
            <MiniAlert color="#f59e0b" label="Splatné 7 d" amount={sum(due7Out)} count={due7Out.length} onClick={onGoToCashflow} />
            <MiniAlert color="#3b82f6" label="Splatné 30 d" amount={sum(due30Out)} count={due30Out.length} onClick={onGoToCashflow} />
          </div>
        </div>

        <div style={styles.dashPanel}>
          <div style={{ ...styles.dashPanelHeader, color: '#10b981' }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
              <ArrowUpCircle size={15} style={{ transform: 'rotate(180deg)' }} /> Inflows (platby od klientů)
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
            <MiniAlert color="#dc2626" label="Po splatnosti" amount={sum(overdueIn)} count={overdueIn.length} urgent={overdueIn.length > 0} onClick={onGoToCashflow} />
            <MiniAlert color="#10b981" label="Splatné 7 d" amount={sum(due7In)} count={due7In.length} onClick={onGoToCashflow} />
            <MiniAlert color="#0d3825" label="Splatné 30 d" amount={sum(due30In)} count={due30In.length} onClick={onGoToCashflow} />
          </div>
        </div>
      </div>

      {/* Panel: Příchozí platby po splatnosti */}
      {overdueIncoming.length > 0 && (
        <div style={{ ...styles.dashPanel, marginBottom: 20, borderTop: '3px solid #dc2626' }}>
          <div style={styles.dashPanelHeader}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#dc2626' }}>
                ⚠ Příchozí platby po splatnosti ({overdueIncoming.length})
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>
                Platby od klientů, které měly být zaplaceny
              </p>
            </div>
            <button style={styles.sortBtn} onClick={onGoToCashflow}>
              Cash Flow →
            </button>
          </div>
          <div style={{ overflow: 'auto' }}>
            <table style={{ ...styles.table, fontSize: 12 }}>
              <thead>
                <tr>
                  <th style={styles.th}>Splatnost</th>
                  <th style={styles.th}>Popis</th>
                  <th style={styles.th}>Projekt</th>
                  <th style={styles.th}>Status</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Částka</th>
                </tr>
              </thead>
              <tbody>
                {overdueIncoming.map((p) => {
                  const dueIn = daysBetween(p.dueDate, today);
                  const st = CLIENT_PAYMENT_STATUSES.find(s => s.id === p.status);
                  return (
                    <tr
                      key={p.paymentId}
                      style={{ ...styles.tr, background: '#fef2f2', cursor: 'pointer' }}
                      onClick={() => onGoToProject && onGoToProject(p.projectId)}
                      title="Otevřít projekt"
                    >
                      <td style={styles.td}>
                        <div style={{ fontWeight: 500 }}>{p.dueDate}</div>
                        <div style={{ fontSize: 10, color: '#dc2626', fontWeight: 600 }}>
                          {Math.abs(dueIn)} dní po splatnosti
                        </div>
                      </td>
                      <td style={styles.td}>{p.label}</td>
                      <td style={{ ...styles.td, fontSize: 11 }}>
                        <div>{p.projectName}</div>
                        {p.projectClient && <div style={{ fontSize: 10, color: '#94a3b8' }}>{p.projectClient}</div>}
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                          color: st?.color, background: st?.bg,
                        }}>{st?.label}</span>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'right', fontWeight: 700, color: '#10b981' }}>
                        +{fmt(p.amount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Panel: Příchozí platby splatné brzy */}
      {dueSoonIncoming.length > 0 && (
        <div style={{ ...styles.dashPanel, marginBottom: 20 }}>
          <div style={styles.dashPanelHeader}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>
                📅 Příchozí platby splatné brzy ({dueSoonIncoming.length})
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>
                Platby od klientů splatné v následujících 5 dnech
              </p>
            </div>
            <button style={styles.sortBtn} onClick={onGoToCashflow}>
              Cash Flow →
            </button>
          </div>
          <div style={{ overflow: 'auto' }}>
            <table style={{ ...styles.table, fontSize: 12 }}>
              <thead>
                <tr>
                  <th style={styles.th}>Splatnost</th>
                  <th style={styles.th}>Popis</th>
                  <th style={styles.th}>Projekt</th>
                  <th style={styles.th}>Status</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Částka</th>
                </tr>
              </thead>
              <tbody>
                {dueSoonIncoming.map((p) => {
                  const dueIn = daysBetween(p.dueDate, today);
                  const st = CLIENT_PAYMENT_STATUSES.find(s => s.id === p.status);
                  return (
                    <tr
                      key={p.paymentId}
                      style={{ ...styles.tr, cursor: 'pointer' }}
                      onClick={() => onGoToProject && onGoToProject(p.projectId)}
                      title="Otevřít projekt"
                    >
                      <td style={styles.td}>
                        <div style={{ fontWeight: 500 }}>{p.dueDate}</div>
                        <div style={{ fontSize: 10, color: '#94a3b8' }}>
                          {dueIn === 0 ? 'dnes' : `za ${dueIn} ${dueIn === 1 ? 'den' : dueIn < 5 ? 'dny' : 'dní'}`}
                        </div>
                      </td>
                      <td style={styles.td}>{p.label}</td>
                      <td style={{ ...styles.td, fontSize: 11 }}>
                        <div>{p.projectName}</div>
                        {p.projectClient && <div style={{ fontSize: 10, color: '#94a3b8' }}>{p.projectClient}</div>}
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                          color: st?.color, background: st?.bg,
                        }}>{st?.label}</span>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'right', fontWeight: 700, color: '#10b981' }}>
                        +{fmt(p.amount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div style={styles.dashSplit}>
        {/* Upcoming items to order */}
        <div style={styles.dashPanel}>
          <div style={styles.dashPanelHeader}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Nadcházející položky k objednání</h3>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>
                Položky z nákupního seznamu seřazené podle plánovaného data objednání
                {itemsWithoutOrderDate > 0 && (
                  <span style={{ marginLeft: 6, padding: '1px 6px', borderRadius: 999, background: '#fef3c7', color: '#92400e', fontSize: 11, fontWeight: 600 }}>
                    +{itemsWithoutOrderDate} bez data
                  </span>
                )}
              </p>
            </div>
            <button style={styles.sortBtn} onClick={onGoToPurchaseList}>
              Nákupní seznam →
            </button>
          </div>

          {upcomingToOrder.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8' }}>
              <ShoppingCart size={32} style={{ color: '#10b981', marginBottom: 10 }} />
              <p style={{ margin: 0 }}>Žádné položky čekající na objednání s nastaveným datem.</p>
              {itemsWithoutOrderDate > 0 && (
                <p style={{ margin: '6px 0 0', fontSize: 12 }}>
                  V nákupním seznamu je {itemsWithoutOrderDate} {itemsWithoutOrderDate === 1 ? 'položka' : itemsWithoutOrderDate < 5 ? 'položky' : 'položek'} bez plánovaného data objednání.
                </p>
              )}
            </div>
          ) : (
            <div style={{ maxHeight: 540, overflowY: 'auto' }}>
              {upcomingToOrder.slice(0, 30).map((it) => {
                const days = daysBetween(it.plannedOrderDate, today);
                const isOverdue = days < 0;
                const isSoon = days >= 0 && days <= 7;
                return (
                  <div
                    key={`order-${it.projectId}-${it.itemId}`}
                    style={styles.paymentRow}
                    onClick={() => onOpenItem(it.projectId, it.itemId)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
                      <div style={{
                        ...styles.dueDateChip,
                        background: isOverdue ? '#fee2e2' : isSoon ? '#fef3c7' : '#f1f5f9',
                        color: isOverdue ? '#dc2626' : isSoon ? '#d97706' : '#475569',
                      }}>
                        <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {isOverdue ? `${-days} d zpoždění` : days === 0 ? 'Dnes' : days === 1 ? 'Zítra' : `za ${days} d`}
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 700, marginTop: 2 }}>{it.plannedOrderDate.slice(5)}</div>
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <span style={{
                            fontSize: 10, padding: '2px 6px', borderRadius: 4,
                            background: '#fef3c7', color: '#92400e',
                            fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em',
                            display: 'inline-flex', alignItems: 'center', gap: 3,
                          }}>
                            <ShoppingCart size={10} /> OBJEDNAT
                          </span>
                          <span style={{ fontWeight: 600, fontSize: 14 }}>{it.itemName}</span>
                          {it.supplierMissing && (
                            <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: '#fee2e2', color: '#b91c1c', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                              ⚠ bez dodavatele
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {it.supplierName} · {it.projectName}
                          {it.quantity && it.unit && (
                            <span style={{ marginLeft: 6, color: '#94a3b8' }}>· {it.quantity} {it.unit}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', color: '#0f172a' }}>
                      {fmt(it.amount)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={styles.dashPanel}>
            <div style={styles.dashPanelHeader}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Portfolio</h3>
            </div>
            <div style={{ padding: '12px 16px' }}>
              <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={styles.summaryLabel}>Projekty</div>
                  <div style={{ fontSize: 22, fontWeight: 700, marginTop: 2 }}>{totalProjects}</div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                    <span style={{ color: '#1d4ed8', fontWeight: 600 }}>{projects.filter(p => (p.status || 'active') === 'active').length}</span>
                    {' '}v procesu ·{' '}
                    <span style={{ color: '#15803d', fontWeight: 600 }}>{projects.filter(p => p.status === 'completed').length}</span>
                    {' '}dokončeno
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={styles.summaryLabel}>Položky</div>
                  <div style={{ fontSize: 22, fontWeight: 700, marginTop: 2 }}>{totalItems}</div>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.dashPanel}>
            <div style={styles.dashPanelHeader}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Stav položek</h3>
            </div>
            <div style={{ padding: '8px 0' }}>
              {STATUSES.map(s => {
                const Icon = s.icon;
                const count = statusCounts[s.id];
                const pct = totalItems > 0 ? (count / totalItems) * 100 : 0;
                return (
                  <div key={s.id} style={{ padding: '8px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: s.color }}>
                        <Icon size={13} /> {s.label}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{count}</span>
                    </div>
                    <div style={{ height: 4, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: s.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Projects grid */}
      <div style={{ ...styles.dashPanel, marginTop: 16 }}>
        <div style={styles.dashPanelHeader}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Projekty</h3>
        </div>
        <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
          {projects.map(p => {
            const cost = p.items.reduce((s, i) => s + toCZK(i, fxRate), 0);
            const itemCount = p.items.length;
            const isCompleted = (p.status || 'active') === 'completed';
            return (
              <div key={p.id} style={{ ...styles.dashProjectCard, opacity: isCompleted ? 0.75 : 1 }} onClick={() => onGoToProject(p.id)}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>{p.name}</div>
                  <ProjectStatusBadge status={p.status || 'active'} />
                </div>
                {p.client && <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{p.client}</div>}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6, marginTop: 10, fontSize: 12 }}>
                  <div>
                    <div style={{ color: '#64748b', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Položky</div>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{itemCount}</div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Náklady</div>
                    <div style={{ fontWeight: 600, color: '#dc2626' }}>{fmt(cost)}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

function MiniAlert({ color, label, amount, count, onClick, urgent }) {
  return (
    <div onClick={onClick} style={{
      padding: '12px 14px', cursor: onClick ? 'pointer' : 'default',
      borderLeft: `3px solid ${color}`,
      animation: urgent && count > 0 ? 'pulse 2s ease-in-out infinite' : 'none',
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4, color: count > 0 ? '#0f172a' : '#cbd5e1' }}>{fmt(amount)}</div>
      <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{count} payment{count !== 1 ? 's' : ''}</div>
      <style>{`@keyframes pulse { 0%,100% { box-shadow: inset 4px 0 0 ${color}; } 50% { box-shadow: inset 4px 0 0 ${color}, 0 0 0 4px ${color}22; } }`}</style>
    </div>
  );
}

// ==========================================================================
// Empty + Sidebar
// ==========================================================================

function EmptyState({ onCreate }) {
  return (
    <div style={styles.empty}>
      <div style={styles.emptyIcon}><Package size={64} style={{ color: '#94a3b8' }} /></div>
      <h2 style={styles.emptyTitle}>Zatím žádné projekty</h2>
      <p style={styles.emptyText}>Vytvořte svůj první projekt a začněte plánovat.</p>
      <button style={styles.primaryBtn} onClick={onCreate}><FolderPlus size={16} /> Vytvořit první projekt</button>
    </div>
  );
}

function ProjectSidebar({ projects, activeId, fxRate, readOnly, onSelect, onDelete }) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('active'); // 'active' | 'completed' | 'all'
  const [confirmDeleteId, setConfirmDeleteId] = useState(null); // id projektu čekajícího na potvrzení smazání

  const filtered = useMemo(() => {
    // Systémový projekt "Sklad" se v sidebaru nezobrazuje —
    // je přístupný jen jako volba v importech a při spotřebě, jinak by mátl uživatele.
    let list = projects.filter(p => !p.isStockProject);
    // Status filter
    if (statusFilter === 'active') list = list.filter(p => (p.status || 'active') === 'active');
    else if (statusFilter === 'completed') list = list.filter(p => p.status === 'completed');
    // Search
    if (query.trim()) {
      list = list.filter(p => searchMatch(query, [
        p.name, p.client, p.power,
        ...p.items.map(i => i.name),
        ...p.items.map(i => i.notes),
        ...p.items.map(i => i.orderNumber),
      ]));
    }
    return list;
  }, [projects, query, statusFilter]);

  // Počty berou v úvahu jen reálné projekty (Sklad se nepočítá)
  const realProjects = projects.filter(p => !p.isStockProject);
  const activeCount = realProjects.filter(p => (p.status || 'active') === 'active').length;
  const completedCount = realProjects.filter(p => p.status === 'completed').length;

  return (
    <aside style={styles.sidebar}>
      <div style={styles.sidebarHeader}>Projekty ({filtered.length}{filtered.length !== projects.length ? ` / ${projects.length}` : ''})</div>
      <div style={{ padding: '0 4px 10px' }}>
        <SearchInput value={query} onChange={setQuery} placeholder="Hledat projekt, klienta..." />
      </div>
      <div style={{ display: 'flex', gap: 4, padding: '0 4px 10px', flexWrap: 'wrap' }}>
        <button onClick={() => setStatusFilter('active')} style={{ ...(statusFilter === 'active' ? styles.sortBtnActive : styles.sortBtn), fontSize: 11 }}>
          V procesu ({activeCount})
        </button>
        <button onClick={() => setStatusFilter('completed')} style={{ ...(statusFilter === 'completed' ? styles.sortBtnActive : styles.sortBtn), fontSize: 11 }}>
          Dokončené ({completedCount})
        </button>
        <button onClick={() => setStatusFilter('all')} style={{ ...(statusFilter === 'all' ? styles.sortBtnActive : styles.sortBtn), fontSize: 11 }}>
          Vše
        </button>
      </div>
      <div style={styles.projectList}>
        {filtered.length === 0 ? (
          <div style={{ padding: 16, color: '#94a3b8', fontSize: 13, textAlign: 'center' }}>
            Nic nenalezeno.
          </div>
        ) : filtered.map(p => {
          const total = p.items.reduce((s, i) => s + toCZK(i, fxRate), 0);
          const isActive = p.id === activeId;
          const isCompleted = (p.status || 'active') === 'completed';
          return (
            <div key={p.id} onClick={() => onSelect(p.id)} style={{ ...styles.projectCard, ...(isActive ? styles.projectCardActive : {}), opacity: isCompleted ? 0.7 : 1 }}>
              <div style={styles.projectCardHeader}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {isCompleted && <CheckCircle2 size={12} style={{ color: '#10b981', flexShrink: 0 }} />}
                    <div style={styles.projectName}>{p.name}</div>
                  </div>
                  {p.client && <div style={styles.projectClient}>{p.client}</div>}
                </div>
                {!readOnly && (
                  confirmDeleteId === p.id ? (
                    <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', gap: 4, alignItems: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 11, color: '#dc2626', fontWeight: 600, marginRight: 2 }}>Opravdu?</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(p.id); setConfirmDeleteId(null); }}
                        style={{ ...styles.iconBtn, color: '#dc2626', background: '#fee2e2', border: '1px solid #fca5a5' }}
                        title="Potvrdit smazání"
                      ><Trash2 size={14} /></button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); }}
                        style={{ ...styles.iconBtn, color: '#64748b' }}
                        title="Zrušit"
                      ><X size={14} /></button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(p.id); }}
                      style={styles.iconBtn}
                      title="Smazat projekt"
                    ><Trash2 size={14} /></button>
                  )
                )}
              </div>
              <div style={styles.projectMeta}>
                {p.power && <span>{p.power} kWp</span>}
                <span>{p.items.length} položek</span>
                {isCompleted && <span style={{ color: '#10b981', fontWeight: 600 }}>Dokončeno</span>}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12 }}>
                <span style={{ color: '#dc2626' }}>-{fmt(total)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

// Reusable search input with clear button
function SearchInput({ value, onChange, placeholder }) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none', display: 'flex' }}>
        <Search size={14} />
      </div>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ ...styles.input, paddingLeft: 32, paddingRight: value ? 30 : 12, fontSize: 13 }}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4, display: 'flex' }}
          title="Vymazat vyhledávání"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
// ==========================================================================
// Project completion validation
// Returns { ok: boolean, blockers: [{ kind, count, totalCZK, samples: [name] }] }
// A project is closeable when EVERY item is 'delivered' AND isInvoiced.
function validateCompletion(project, fxRate, settings) {
  const blockers = [];
  const items = project.items || [];

  if (items.length === 0) {
    blockers.push({ kind: 'noItems', label: 'Projekt nemá žádné položky', count: 0, totalCZK: 0, samples: [] });
    return { ok: false, blockers };
  }

  // Projekt je dokončitelný, když všechny položky jsou dodané a vyfakturované
  const buckets = {
    planned: { kind: 'planned', label: 'položek je teprve plánovaných (zatím neobjednáno)', items: [] },
    ordered: { kind: 'ordered', label: 'položek je objednáno, ale zatím nedodáno', items: [] },
    delivered_not_invoiced: { kind: 'delivered_not_invoiced', label: 'položek je dodáno, ale zatím nevyfakturováno', items: [] },
  };

  items.forEach(i => {
    const s = i.status || 'planned';
    if (s === 'planned') buckets.planned.items.push(i);
    else if (s === 'ordered') buckets.ordered.items.push(i);
    else if (s === 'delivered' && !i.isInvoiced) buckets.delivered_not_invoiced.items.push(i);
    // s === 'delivered' && isInvoiced → completed, no blocker
  });

  Object.values(buckets).forEach(b => {
    if (b.items.length > 0) {
      blockers.push({
        kind: b.kind,
        label: b.label,
        count: b.items.length,
        totalCZK: b.items.reduce((s, i) => s + toCZK(i, fxRate), 0),
        samples: b.items.slice(0, 3).map(i => i.name),
      });
    }
  });

  return { ok: blockers.length === 0, blockers };
}

function ProjectView({ project, categories, suppliers, fxRate, settings, readOnly, pdfAttachments, onAddItem, onEditItem, onDeleteItem, onEditBudgets, onEditMeta, onImport, onManageSuppliers, onSetProjectStatus, onAddClientPayment, onUpdateClientPayment, onDeleteClientPayment, onApplyPaymentTemplate, paymentPlanTemplates, onDeletePdfAttachment, onAddPdfToProject, onGoToPurchaseList, onGoToOrders }) {
  const [closeModal, setCloseModal] = useState(null); // { ok, blockers } — null = closed
  const [tab, setTab] = useState('dashboard'); // dashboard | payments | items | pdfs

  const spendByCategory = useMemo(() => {
    return categories.reduce((acc, cat) => {
      acc[cat.id] = project.items.filter(i => i.category === cat.id).reduce((sum, i) => sum + toCZK(i, fxRate), 0);
      return acc;
    }, {});
  }, [project, categories, fxRate]);

  const totalSpend = Object.values(spendByCategory).reduce((a, b) => a + b, 0);
  const totalBudget = Object.values(project.budgets).reduce((a, b) => a + (Number(b) || 0), 0);
  const overBudget = categories.filter(c => (project.budgets[c.id] || 0) > 0 && spendByCategory[c.id] > project.budgets[c.id]).length;

  const materialTotal = categories.filter(c => c.kind === 'material').reduce((s, c) => s + (spendByCategory[c.id] || 0), 0);
  const laborTotal = categories.filter(c => c.kind === 'labor').reduce((s, c) => s + (spendByCategory[c.id] || 0), 0);
  const commissionTotal = categories.filter(c => c.kind === 'commission').reduce((s, c) => s + (spendByCategory[c.id] || 0), 0);

  const byStatus = STATUSES.reduce((acc, s) => {
    acc[s.id] = project.items.filter(i => (i.status || 'planned') === s.id).length;
    return acc;
  }, {});

  // PDF dokumenty spojené s tímto projektem (buď explicitně přidané, nebo z importu objednávky)
  const projectPdfs = useMemo(() => {
    return (pdfAttachments || []).filter(a => a.projectId === project.id);
  }, [pdfAttachments, project.id]);

  const clientPaymentsCount = (project.clientPayments || []).length;

  return (
    <main style={styles.main}>
      <div style={styles.mainHeader}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h2 style={styles.projectTitle}>{project.name}</h2>
            <ProjectStatusBadge status={project.status || 'active'} />
            {!readOnly && (
              <button style={styles.iconBtn} onClick={onEditMeta} title="Upravit projekt"><Edit3 size={15} /></button>
            )}
          </div>
          <div style={styles.projectTags}>
            {project.client && <span style={styles.tag}>{project.client}</span>}
            {project.power && <span style={styles.tag}>{project.power} kWp</span>}
            <span style={styles.tag}>{project.items.length} položek</span>
            <span style={styles.tag}>EUR → CZK @ {fxRate}</span>
          </div>
        </div>
        <div style={styles.headerActions}>
          {!readOnly && ((project.status || 'active') === 'completed' ? (
            <button style={styles.secondaryBtn} onClick={() => onSetProjectStatus('active')}>
              <CircleDot size={15} /> Znovu otevřít projekt
            </button>
          ) : (
            <button style={styles.secondaryBtn} onClick={() => {
              const result = validateCompletion(project, fxRate, settings);
              setCloseModal(result);
            }}>
              <CheckCircle2 size={15} /> Označit jako dokončené
            </button>
          ))}
          {!readOnly && tab === 'items' && (
            <>
              <button style={styles.secondaryBtn} onClick={onImport}><Upload size={15} /> Import</button>
              <button style={styles.primaryBtn} onClick={onAddItem}><Plus size={15} /> Přidat položku</button>
            </>
          )}
          {!readOnly && tab === 'dashboard' && (
            <button style={styles.secondaryBtn} onClick={onEditBudgets}><TrendingUp size={15} /> Rozpočty</button>
          )}
        </div>
      </div>

      {/* Záložky */}
      <div style={{
        display: 'flex', gap: 0, marginTop: 16, marginBottom: 16,
        borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap',
      }}>
        {[
          { id: 'dashboard', label: 'Dashboard', icon: <TrendingUp size={13} />, count: null },
          { id: 'payments', label: 'Platby', icon: <ArrowDownCircle size={13} />, count: clientPaymentsCount },
          { id: 'items', label: 'Položky', icon: <Package size={13} />, count: project.items.length },
          { id: 'pdfs', label: 'Archiv PDF', icon: <FileText size={13} />, count: projectPdfs.length },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '10px 18px', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: tab === t.id ? '#0d3825' : '#94a3b8',
              borderBottom: tab === t.id ? '2px solid #0d3825' : '2px solid transparent',
              marginBottom: -1, display: 'inline-flex', alignItems: 'center', gap: 6,
            }}
          >
            {t.icon} {t.label}
            {t.count != null && t.count > 0 && (
              <span style={{
                padding: '1px 7px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                background: tab === t.id ? '#0d3825' : '#e2e8f0',
                color: tab === t.id ? '#fff' : '#64748b',
              }}>{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Dashboard záložka */}
      {tab === 'dashboard' && (
        <>
          {/* Project cost & revenue summary */}
          <div style={styles.plBanner}>
            <div style={styles.plItem}>
              <div style={styles.plLabel}><ArrowUpCircle size={13} /> Celkové náklady (položky)</div>
              <div style={{ ...styles.plValue, color: '#dc2626' }}>{fmt(totalSpend)}</div>
              <div style={styles.plSub}>Materiál {fmt(materialTotal)} · Práce {fmt(laborTotal)} · Řízení {fmt(commissionTotal)}</div>
            </div>
            {(parseFloat(project.contractValue) || 0) > 0 && (
              <>
                <div style={styles.plItem}>
                  <div style={styles.plLabel}>💰 Hodnota smlouvy (bez DPH)</div>
                  <div style={{ ...styles.plValue, color: '#0d3825' }}>{fmt(parseFloat(project.contractValue) || 0)}</div>
                  <div style={styles.plSub}>DPH {parseFloat(project.vatRate) || 0} % · Klient zaplatí {fmt(computeProjectGrossValue(project))}</div>
                </div>
                <div style={styles.plItem}>
                  <div style={styles.plLabel}>📊 Hrubá marže (bez DPH)</div>
                  {(() => {
                    const margin = (parseFloat(project.contractValue) || 0) - totalSpend;
                    const marginPct = totalSpend > 0 ? (margin / (parseFloat(project.contractValue) || 1)) * 100 : 0;
                    return (
                      <>
                        <div style={{ ...styles.plValue, color: margin >= 0 ? '#15803d' : '#dc2626' }}>{fmt(margin)}</div>
                        <div style={styles.plSub}>{marginPct.toFixed(1)} % z hodnoty smlouvy</div>
                      </>
                    );
                  })()}
                </div>
              </>
            )}
          </div>

          {/* Status pipeline */}
          <div style={styles.statusPipeline}>
            {STATUSES.map(s => {
              const Icon = s.icon;
              return (
                <div key={s.id} style={{ ...styles.pipelineCard, borderLeft: `3px solid ${s.color}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: s.color }}>
                    <Icon size={14} />
                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</span>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>{byStatus[s.id]}</div>
                </div>
              );
            })}
          </div>

          <div style={styles.summaryGrid}>
            <SummaryCard label="Materiál" value={fmt(materialTotal)} accent="#f59e0b" icon={<Package size={15} />} />
            <SummaryCard label="Práce a subdodávky" value={fmt(laborTotal)} accent="#0ea5e9" icon={<Wrench size={15} />} />
            <SummaryCard label="Provize a řízení" value={fmt(commissionTotal)} accent="#d946ef" icon={<Briefcase size={15} />} />
            <SummaryCard label="Celkový rozpočet" value={totalBudget > 0 ? fmt(totalBudget) : 'Nenastaveno'} accent="#3b82f6" />
            <SummaryCard label={overBudget > 0 ? 'Překročený rozpočet' : 'Stav'} value={overBudget > 0 ? `${overBudget} over` : 'V pořádku'} accent={overBudget > 0 ? '#dc2626' : '#10b981'} icon={overBudget > 0 ? <AlertTriangle size={15} /> : <CheckCircle2 size={15} />} />
          </div>

          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Sledování rozpočtu podle kategorií</h3>
            <CategoryGroups categories={categories} spendByCategory={spendByCategory} budgets={project.budgets} items={project.items} />
          </section>
        </>
      )}

      {/* Platby záložka */}
      {tab === 'payments' && (
        <section style={styles.section}>
          <ClientPaymentsPanel
            project={project}
            readOnly={readOnly}
            onAdd={onAddClientPayment}
            onUpdate={onUpdateClientPayment}
            onDelete={onDeleteClientPayment}
            onApplyTemplate={onApplyPaymentTemplate}
            paymentPlanTemplates={paymentPlanTemplates}
            fxRate={fxRate}
          />
        </section>
      )}

      {/* Položky záložka */}
      {tab === 'items' && (
        <section style={styles.section}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
            <h3 style={{ ...styles.sectionTitle, margin: 0 }}>Soupis materiálu a služeb ({project.items.length})</h3>
            <div style={{ display: 'inline-flex', gap: 6, flexWrap: 'wrap' }}>
              {suppliers.length === 0 && <button style={styles.sortBtn} onClick={onManageSuppliers}><Users size={12} /> Přidat dodavatele</button>}
              {onGoToPurchaseList && (
                <button
                  style={styles.sortBtn}
                  onClick={onGoToPurchaseList}
                  title="Otevřít Nákupní seznam vyfiltrovaný na tento projekt"
                >
                  <ShoppingCart size={12} /> Nákupní seznam <ArrowRight size={11} />
                </button>
              )}
              {onGoToOrders && (
                <button
                  style={styles.sortBtn}
                  onClick={onGoToOrders}
                  title="Otevřít Objednávky vyfiltrované na tento projekt"
                >
                  <Truck size={12} /> Objednávky <ArrowRight size={11} />
                </button>
              )}
            </div>
          </div>
          {project.items.length === 0 ? (
            <div style={styles.emptyItems}>
              <Package size={32} style={{ color: '#cbd5e1' }} />
              <p style={{ color: '#64748b', margin: '12px 0 16px' }}>Zatím žádné položky.</p>
              {!readOnly && (
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button style={styles.secondaryBtn} onClick={onImport}><Upload size={15} /> Importovat CSV</button>
                  <button style={styles.primaryBtn} onClick={onAddItem}><Plus size={15} /> Přidat položku</button>
                </div>
              )}
            </div>
          ) : (
            <ItemsTable items={project.items} categories={categories} suppliers={suppliers} exchangeRate={fxRate} onEdit={onEditItem} onDelete={onDeleteItem} readOnly={readOnly} />
          )}
        </section>
      )}

      {/* Archiv PDF záložka */}
      {tab === 'pdfs' && (
        <section style={styles.section}>
          <ProjectPdfArchive
            projectId={project.id}
            projectName={project.name}
            projectItems={project.items || []}
            fxRate={fxRate}
            pdfs={projectPdfs}
            readOnly={readOnly}
            onDelete={onDeletePdfAttachment}
            onAddFile={onAddPdfToProject}
          />
        </section>
      )}

      {closeModal && (
        <CompleteProjectModal
          project={project}
          result={closeModal}
          onConfirm={() => { onSetProjectStatus('completed'); setCloseModal(null); }}
          onClose={() => setCloseModal(null)}
        />
      )}
    </main>
  );
}

// ==========================================================================
// ProjectPdfArchive — seznam PDF souvisejících s projektem
// ==========================================================================

function ProjectPdfArchive({ projectId, projectName, projectItems, fxRate, pdfs, readOnly, onDelete, onAddFile }) {
  const [confirmDel, setConfirmDel] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Zvolte prosím PDF soubor.');
      return;
    }
    setUploading(true);
    try {
      await onAddFile(file);
    } finally {
      setUploading(false);
      e.target.value = ''; // reset abychom mohli přidat další
    }
  };

  const openPdf = async (attachment) => {
    try {
      await openPdfInNewTab(attachment.id, attachment.filename);
    } catch (err) {
      alert('Nepodařilo se otevřít PDF: ' + (err.message || err));
    }
  };

  const downloadPdf = async (attachment) => {
    try {
      const record = await getPdfFromDb(attachment.id);
      if (!record) throw new Error('PDF již není v databázi.');
      const bytes = Uint8Array.from(atob(record.base64), c => c.charCodeAt(0));
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = buildFilename(attachment);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (e) {
      alert('Nepodařilo se stáhnout PDF: ' + (e.message || e));
    }
  };

  const sorted = [...pdfs].sort((a, b) => (b.importedAt || '').localeCompare(a.importedAt || ''));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h3 style={{ ...styles.sectionTitle, margin: 0 }}>Archiv PDF ({pdfs.length})</h3>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 12 }}>
            Automaticky se sem řadí PDF importované z faktur pro projekt <strong>{projectName}</strong>. Můžete přidat i vlastní dokumenty (smlouvy, protokoly...).
          </p>
        </div>
        {!readOnly && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleFileSelected}
              style={{ display: 'none' }}
            />
            <button
              style={styles.primaryBtn}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? 'Nahrávám…' : <><Plus size={14} /> Přidat PDF</>}
            </button>
          </div>
        )}
      </div>

      {pdfs.length === 0 ? (
        <div style={{ padding: 30, textAlign: 'center', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 8 }}>
          <FileText size={32} style={{ color: '#cbd5e1', marginBottom: 8 }} />
          <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
            K tomuto projektu zatím nejsou přiřazena žádná PDF.
          </p>
          <p style={{ color: '#94a3b8', fontSize: 12, margin: '4px 0 0' }}>
            PDF se sem sama přidají, když v Objednávkách naimportujete fakturu pro tento projekt.
          </p>
        </div>
      ) : (
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Soubor</th>
                <th style={styles.th}>Dodavatel</th>
                <th style={styles.th}>Č. faktury</th>
                <th style={styles.th}>Importováno</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Položek</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Částka bez DPH (Kč)</th>
                <th style={{ ...styles.th, width: 220 }}>Akce</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(att => {
                // Součet částky za všechny položky projektu spojené s touto PDF přílohou
                const linkedItems = (projectItems || []).filter(i => i.pdfAttachmentId === att.id);
                const totalCZK = linkedItems.reduce((sum, i) => sum + toCZK(i, fxRate || 25), 0);
                return (
                <tr key={att.id} style={styles.tr}>
                  <td style={styles.td}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <FileText size={14} style={{ color: '#dc2626' }} />
                      <span style={{ fontSize: 12 }}>{att.filename}</span>
                      {att.manuallyAdded && (
                        <span style={{ fontSize: 10, padding: '1px 5px', borderRadius: 3, background: '#fef3c7', color: '#92400e', fontWeight: 700 }} title="Ručně přidané">ručně</span>
                      )}
                    </span>
                  </td>
                  <td style={{ ...styles.td, fontSize: 12 }}>{att.supplierName || '—'}</td>
                  <td style={{ ...styles.td, fontSize: 11, fontFamily: 'monospace' }}>{att.orderNumber || '—'}</td>
                  <td style={{ ...styles.td, fontSize: 11, color: '#64748b' }}>
                    {att.importedAt ? new Date(att.importedAt).toLocaleString('cs-CZ', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                  </td>
                  <td style={{ ...styles.td, textAlign: 'right' }}>
                    <span style={{ padding: '2px 7px', borderRadius: 4, background: '#eff6ff', color: '#1d4ed8', fontSize: 11, fontWeight: 700 }}>
                      {att.itemCount || 0}
                    </span>
                  </td>
                  <td style={{ ...styles.td, textAlign: 'right', fontSize: 12, fontWeight: 600 }}>
                    {totalCZK > 0 ? fmt(totalCZK) : <span style={{ color: '#cbd5e1', fontWeight: 400 }}>—</span>}
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: 'inline-flex', gap: 4 }}>
                      <button
                        onClick={() => openPdf(att)}
                        style={{ ...styles.sortBtn, padding: '4px 8px', background: '#0d3825', color: '#fff', borderColor: '#0d3825' }}
                        title="Otevřít v novém okně"
                      >
                        <Eye size={12} /> Otevřít
                      </button>
                      <button
                        onClick={() => downloadPdf(att)}
                        style={{ ...styles.iconBtn }}
                        title="Stáhnout"
                      >
                        <Download size={13} />
                      </button>
                      {!readOnly && (
                        confirmDel === att.id ? (
                          <div style={{ display: 'inline-flex', gap: 3 }}>
                            <button
                              onClick={() => { onDelete(att.id); setConfirmDel(null); }}
                              style={{ ...styles.iconBtn, color: '#dc2626', background: '#fee2e2', border: '1px solid #fca5a5' }}
                              title="Potvrdit"
                            ><Trash2 size={13} /></button>
                            <button
                              onClick={() => setConfirmDel(null)}
                              style={{ ...styles.iconBtn, color: '#64748b' }}
                              title="Zrušit"
                            ><X size={13} /></button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDel(att.id)}
                            style={{ ...styles.iconBtn, color: '#dc2626' }}
                            title="Smazat"
                          ><Trash2 size={13} /></button>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ==========================================================================
// Project status badge + Complete project modal
// ==========================================================================

function ProjectStatusBadge({ status }) {
  if (status === 'completed') {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        fontSize: 11, padding: '3px 9px', borderRadius: 999,
        background: '#dcfce7', color: '#15803d',
        fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>
        <CheckCircle2 size={11} /> Dokončeno
      </span>
    );
  }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 11, padding: '3px 9px', borderRadius: 999,
      background: '#dbeafe', color: '#1d4ed8',
      fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
    }}>
      <CircleDot size={11} /> V procesu
    </span>
  );
}

function CompleteProjectModal({ project, result, onConfirm, onClose }) {
  const { ok, blockers } = result;

  return (
    <Modal title={ok ? 'Označit projekt jako dokončený' : 'Projekt nelze dokončit'} onClose={onClose} maxWidth={580}>
      <p style={{ color: '#64748b', fontSize: 14, margin: '0 0 14px' }}>
        Projekt: <strong>{project.name}</strong>{project.client ? ` · ${project.client}` : ''}
      </p>

      {ok ? (
        <>
          <div style={{ padding: 14, background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', borderRadius: 8, fontSize: 13, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>Vše je v pořádku — projekt lze uzavřít</div>
                <div style={{ color: '#166534' }}>
                  Všechny položky jsou ve stavu <strong>Vyfakturováno</strong>.
                </div>
              </div>
            </div>
          </div>
          <p style={{ fontSize: 13, color: '#475569', margin: '0 0 8px' }}>
            <strong>Co se stane po označení:</strong>
          </p>
          <ul style={{ fontSize: 13, color: '#475569', margin: '0 0 16px', paddingLeft: 20 }}>
            <li>Projekt zůstane viditelný v seznamu projektů s odznakem „Dokončeno".</li>
            <li>Můžete projekt kdykoliv znovu otevřít.</li>
          </ul>
        </>
      ) : (
        <>
          <div style={{ padding: 14, background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: 8, fontSize: 13, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>Projekt zatím nelze dokončit</div>
                <div>Pro dokončení musí být všechny položky <strong>objednány, dodány a vyfakturovány</strong>.</div>
              </div>
            </div>
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', marginBottom: 8 }}>
            Co je potřeba dořešit ({blockers.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 4 }}>
            {blockers.map((b, i) => (
              <div key={i} style={{ padding: 12, border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>
                      <span style={{ color: '#dc2626', marginRight: 6 }}>{b.count}</span>
                      {b.label}
                    </div>
                    {b.samples.length > 0 && (
                      <div style={{ fontSize: 12, color: '#64748b', marginTop: 4, fontStyle: 'italic' }}>
                        např.: {b.samples.join(', ')}{b.count > b.samples.length ? ` …a ${b.count - b.samples.length} dalších` : ''}
                      </div>
                    )}
                  </div>
                  {b.totalCZK > 0 && (
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#dc2626', whiteSpace: 'nowrap' }}>
                      {fmt(b.totalCZK)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div style={styles.modalActions}>
        <button style={styles.secondaryBtn} onClick={onClose}>{ok ? 'Zrušit' : 'Zavřít'}</button>
        {ok && (
          <button style={styles.primaryBtn} onClick={onConfirm}>
            <CheckCircle2 size={15} /> Potvrdit dokončení
          </button>
        )}
      </div>
    </Modal>
  );
}
function CategoryGroups({ categories, spendByCategory, budgets, items }) {
  const groups = [
    { kind: 'material', label: 'Materiál', icon: <Package size={14} /> },
    { kind: 'labor', label: 'Práce a subdodavatelé', icon: <Wrench size={14} /> },
    { kind: 'commission', label: 'Provize a řízení', icon: <Briefcase size={14} /> },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {groups.map(g => {
        const cats = categories.filter(c => c.kind === g.kind);
        if (cats.length === 0) return null;
        return (
          <div key={g.kind}>
            <div style={styles.groupLabel}>{g.icon} {g.label}</div>
            <div style={styles.categoryGrid}>
              {cats.map(cat => {
                const spent = spendByCategory[cat.id] || 0;
                const budget = budgets[cat.id] || 0;
                const pct = budget > 0 ? (spent / budget) * 100 : 0;
                const over = budget > 0 && spent > budget;
                const count = items.filter(i => i.category === cat.id).length;
                return (
                  <div key={cat.id} style={styles.categoryCard}>
                    <div style={styles.categoryHeader}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                        <div style={{ ...styles.categoryDot, background: cat.color }} />
                        <span style={styles.categoryName}>{cat.name}</span>
                      </div>
                      <span style={styles.categoryCount}>{count}</span>
                    </div>
                    <div style={styles.categoryAmounts}>
                      <span style={{ ...styles.spentAmount, color: over ? '#dc2626' : '#0f172a' }}>{fmt(spent)}</span>
                      <span style={styles.budgetAmount}>/ {budget > 0 ? fmt(budget) : 'bez rozpočtu'}</span>
                    </div>
                    <div style={styles.progressTrack}>
                      <div style={{ ...styles.progressFill, width: `${Math.min(pct, 100)}%`, background: over ? '#dc2626' : cat.color }} />
                    </div>
                    <div style={styles.progressLabel}>
                      {budget > 0 ? (
                        <span style={{ color: over ? '#dc2626' : '#64748b', fontWeight: over ? 600 : 400 }}>
                          {pct.toFixed(0)}% {over && '· PŘEKR.'}
                        </span>
                      ) : <span style={{ color: '#94a3b8' }}>Bez rozpočtu</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StatusPill({ status, isInvoiced, onChange, onChangeInvoiced, readOnly }) {
  const s = getStatus(status);
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
      <select
        value={status || 'planned'}
        onChange={(e) => onChange && onChange(e.target.value)}
        disabled={readOnly}
        style={{ ...styles.statusPill, color: s.color, borderColor: s.color + '55', background: s.color + '12' }}
      >
        {STATUSES.map(x => <option key={x.id} value={x.id}>{x.label}</option>)}
      </select>
      {onChangeInvoiced !== undefined && (
        <label
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '3px 8px', borderRadius: 4, cursor: readOnly ? 'default' : 'pointer',
            fontSize: 11, fontWeight: 600,
            color: isInvoiced ? '#8b5cf6' : '#94a3b8',
            background: isInvoiced ? '#ede9fe' : '#f1f5f9',
            border: `1px solid ${isInvoiced ? '#c4b5fd' : '#e2e8f0'}`,
            userSelect: 'none',
          }}
          title={isInvoiced ? 'Faktura přijatá' : 'Faktura zatím nedorazila'}
        >
          <input
            type="checkbox"
            checked={!!isInvoiced}
            onChange={(e) => onChangeInvoiced(e.target.checked)}
            disabled={readOnly}
            style={{ margin: 0, cursor: readOnly ? 'default' : 'pointer' }}
          />
          <FileText size={10} /> Vyfakturováno
        </label>
      )}
    </div>
  );
}

// ==========================================================================
// ClientPaymentsPanel — splátky od klienta v projektu
// ==========================================================================

const CLIENT_PAYMENT_STATUSES = [
  { id: 'planned',   label: 'Plánováno',     color: '#64748b', bg: '#f1f5f9' },
  { id: 'invoiced',  label: 'Vyfakturováno', color: '#8b5cf6', bg: '#ede9fe' },
  { id: 'paid',      label: 'Zaplaceno',     color: '#10b981', bg: '#d1fae5' },
];

// ==========================================================================
// Šablony platebních plánů
// ==========================================================================

const INSTALLMENT_TYPES = [
  { id: 'fixed',     label: 'Fixní částka',         shortLabel: 'Kč',         description: 'Pevná částka v Kč (např. 50 000 Kč záloha)' },
  { id: 'percent',   label: 'Procento z hodnoty',   shortLabel: '%',          description: 'Procento z celkové hodnoty projektu (např. 30 %)' },
  { id: 'recurring', label: 'Měsíční splátky zbytku', shortLabel: 'měs.',     description: 'Zbylou částku rozdělit do X měsíčních splátek' },
];

// Aplikace šablony — generuje konkrétní splátky pro daný projekt
// Args:
//   template: { installments: [...] }
//   totalValue: celková hodnota projektu (v Kč)
//   defaultDate: ISO datum, použité pro splátky bez vlastního milníku (fallback)
//   milestoneDates: { [installmentIndex]: ISO datum } — datumy pro každou splátku-milník
// Returns: array of payment objects (bez id - přidá se při uložení)
function applyPaymentTemplate(template, totalValue, defaultDate, milestoneDates = {}) {
  if (!template || !template.installments) return [];
  const total = parseFloat(totalValue) || 0;
  const fallback = new Date((defaultDate || todayISO()) + 'T00:00:00Z');

  // 1) Spočítat fixní + procentní částky (vědomé částky)
  let knownAmount = 0;
  template.installments.forEach(inst => {
    if (inst.type === 'fixed') {
      knownAmount += parseFloat(inst.amount) || 0;
    } else if (inst.type === 'percent') {
      knownAmount += total * ((parseFloat(inst.amount) || 0) / 100);
    }
  });

  // 2) Zbytek = total - knownAmount (pro recurring splátky)
  const remainder = Math.max(0, total - knownAmount);

  // 3) Spočítat počet recurring splátek
  const recurringInstallments = template.installments.filter(i => i.type === 'recurring');
  const totalRecurringMonths = recurringInstallments.reduce((s, i) => s + (parseInt(i.amount, 10) || 0), 0);
  const monthlyRest = totalRecurringMonths > 0 ? remainder / totalRecurringMonths : 0;

  // 4) Generovat splátky — KAŽDÁ splátka je vlastní milník
  const payments = [];
  template.installments.forEach((inst, idx) => {
    const offset = parseInt(inst.dueDateOffsetDays, 10) || 0;

    // Základní datum = datum milníku (nebo fallback, pokud user nezadal)
    const ms = milestoneDates[idx];
    const baseDate = ms ? new Date(ms + 'T00:00:00Z') : new Date(fallback);

    const dueBase = new Date(baseDate);
    dueBase.setUTCDate(dueBase.getUTCDate() + offset);

    const milestoneNote = ` po milníku „${inst.label || 'splátka'}"`;

    if (inst.type === 'fixed') {
      payments.push({
        label: inst.label || `Splátka ${idx + 1}`,
        dueDate: dueBase.toISOString().slice(0, 10),
        amount: parseFloat(inst.amount) || 0,
        currency: 'CZK',
        status: 'planned',
        notes: `Vygenerováno ze šablony: fixní částka${milestoneNote}`,
      });
    } else if (inst.type === 'percent') {
      const amt = total * ((parseFloat(inst.amount) || 0) / 100);
      payments.push({
        label: `${inst.label || 'Splátka'} (${inst.amount}% z ${fmt(total)})`,
        dueDate: dueBase.toISOString().slice(0, 10),
        amount: Math.round(amt * 100) / 100,
        currency: 'CZK',
        status: 'planned',
        notes: `Vygenerováno ze šablony: ${inst.amount}% z hodnoty projektu${milestoneNote}`,
      });
    } else if (inst.type === 'recurring') {
      const months = parseInt(inst.amount, 10) || 0;
      for (let m = 0; m < months; m++) {
        const d = new Date(dueBase);
        d.setUTCMonth(d.getUTCMonth() + m);
        payments.push({
          label: `${inst.label || 'Měsíční splátka'} ${m + 1}/${months}`,
          dueDate: d.toISOString().slice(0, 10),
          amount: Math.round(monthlyRest * 100) / 100,
          currency: 'CZK',
          status: 'planned',
          notes: `Vygenerováno ze šablony: měs. splátka ${m + 1} z ${months} (${fmt(remainder)} / ${months} měs.)${milestoneNote}`,
        });
      }
    }
  });

  return payments;
}

// Spočítat celkovou hodnotu projektu (sum všech položek v CZK)
// POZOR: toto je suma NÁKUPNÍCH cen položek (= náklady projektu), NIKOLI částka,
// kterou platí klient. Pro klientskou hodnotu použijte computeProjectContractValue().
function computeProjectTotal(project, fxRate) {
  if (!project || !project.items) return 0;
  return project.items.reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0;
    const unit = parseFloat(item.unitPrice) || 0;
    const total = qty * unit;
    return sum + (item.currency === 'EUR' ? total * fxRate : total);
  }, 0);
}

// Hodnota smlouvy bez DPH (zadaná uživatelem) — pro platební plán a cash flow
function computeProjectContractValue(project) {
  return parseFloat(project?.contractValue) || 0;
}

// Hodnota smlouvy s DPH (klient zaplatí) — propaguje se do cash flow
function computeProjectGrossValue(project) {
  const net = parseFloat(project?.contractValue) || 0;
  const vat = parseFloat(project?.vatRate) || 0;
  return net * (1 + vat / 100);
}

function ClientPaymentsPanel({ project, readOnly, onAdd, onUpdate, onDelete, paymentPlanTemplates, fxRate, onApplyTemplate }) {
  const payments = project.clientPayments || [];
  const [editing, setEditing] = useState(null); // { payment } - null=closed, {}=new
  const [confirmDel, setConfirmDel] = useState(null);
  const [applyTemplateModal, setApplyTemplateModal] = useState(false);

  // Statistiky
  const stats = useMemo(() => {
    const sum = (status) => payments
      .filter(p => p.status === status)
      .reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);
    const planned = sum('planned');
    const invoiced = sum('invoiced');
    const paid = sum('paid');
    const total = planned + invoiced + paid;
    return { planned, invoiced, paid, total };
  }, [payments]);

  // Seřadit podle data
  const sortedPayments = useMemo(() => {
    return [...payments].sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));
  }, [payments]);

  const sortedItems = sortedPayments;
  const today = todayISO();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
        <h3 style={{ ...styles.sectionTitle, margin: 0, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          💰 Platby od klienta
          {payments.length > 0 && (
            <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>
              ({payments.length} {payments.length === 1 ? 'splátka' : payments.length < 5 ? 'splátky' : 'splátek'})
            </span>
          )}
        </h3>
        {!readOnly && (
          <div style={{ display: 'flex', gap: 8 }}>
            {paymentPlanTemplates && paymentPlanTemplates.length > 0 && (
              <button style={styles.secondaryBtn} onClick={() => setApplyTemplateModal(true)}>
                <FileText size={14} /> Použít šablonu
              </button>
            )}
            <button style={styles.primaryBtn} onClick={() => setEditing({})}>
              <Plus size={14} /> Přidat splátku
            </button>
          </div>
        )}
      </div>

      {payments.length === 0 ? (
        <div style={{ padding: 20, textAlign: 'center', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 8 }}>
          <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 8px' }}>
            Zatím žádné splátky od klienta.
          </p>
          {paymentPlanTemplates && paymentPlanTemplates.length > 0 ? (
            <p style={{ color: '#94a3b8', fontSize: 12, margin: 0 }}>
              Můžete použít některou ze {paymentPlanTemplates.length === 1 ? 'šablony' : paymentPlanTemplates.length < 5 ? 'šablon' : 'šablon'} platebních plánů nebo přidat splátky ručně.
            </p>
          ) : (
            <p style={{ color: '#94a3b8', fontSize: 12, margin: 0 }}>
              Můžete naplánovat platební harmonogram nebo si vytvořit šablony v <strong>Nastavení → Platební plány</strong>.
            </p>
          )}
        </div>
      ) : (
        <>
          {/* Souhrnné karty */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginBottom: 12 }}>
            <PaymentStatCard label="Plánováno" amount={stats.planned} color="#64748b" />
            <PaymentStatCard label="Vyfakturováno" amount={stats.invoiced} color="#8b5cf6" />
            <PaymentStatCard label="Zaplaceno" amount={stats.paid} color="#10b981" />
            <PaymentStatCard label="Celkem" amount={stats.total} color="#0d3825" isTotal />
          </div>

          {/* Tabulka splátek */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'auto', background: '#fff' }}>
            <table style={{ ...styles.table, fontSize: 12 }}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Popis</th>
                  <th style={styles.th}>Splatnost</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Částka</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Vyfakturováno</th>
                  <th style={styles.th}>Zaplaceno</th>
                  {!readOnly && <th style={{ ...styles.th, width: 120 }}>Akce</th>}
                </tr>
              </thead>
              <tbody>
                {sortedPayments.map((p, idx) => {
                  const st = CLIENT_PAYMENT_STATUSES.find(s => s.id === (p.status || 'planned'));
                  const overdue = p.dueDate && p.dueDate < today && p.status !== 'paid';
                  return (
                    <tr key={p.id} style={{ ...styles.tr, background: overdue ? '#fef2f2' : 'transparent' }}>
                      <td style={{ ...styles.td, color: '#94a3b8' }}>{idx + 1}.</td>
                      <td style={styles.td}>
                        <div style={{ fontWeight: 500 }}>{p.label || '(bez popisu)'}</div>
                        {p.notes && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{p.notes}</div>}
                      </td>
                      <td style={styles.td}>
                        {p.dueDate || <span style={{ color: '#cbd5e1' }}>—</span>}
                        {overdue && <div style={{ fontSize: 10, color: '#dc2626', fontWeight: 600 }}>PO SPLATNOSTI</div>}
                      </td>
                      <td style={{ ...styles.td, textAlign: 'right', fontWeight: 600 }}>
                        {fmt2(parseFloat(p.amount) || 0, p.currency || 'CZK')}
                      </td>
                      <td style={styles.td}>
                        {readOnly ? (
                          <span style={{
                            padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                            color: st?.color, background: st?.bg,
                          }}>{st?.label}</span>
                        ) : (
                          <select
                            value={p.status || 'planned'}
                            onChange={e => {
                              const newStatus = e.target.value;
                              const patch = { status: newStatus };
                              // Auto-fill data dne pro nový status
                              if (newStatus === 'invoiced' && !p.invoicedDate) patch.invoicedDate = todayISO();
                              if (newStatus === 'paid' && !p.paidDate) patch.paidDate = todayISO();
                              onUpdate(p.id, patch);
                            }}
                            style={{
                              padding: '3px 6px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                              color: st?.color, background: st?.bg, border: `1px solid ${st?.color}40`,
                              fontFamily: 'inherit', cursor: 'pointer',
                            }}
                          >
                            {CLIENT_PAYMENT_STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                          </select>
                        )}
                      </td>
                      <td style={{ ...styles.td, fontSize: 11, color: '#475569' }}>{p.invoicedDate || '—'}</td>
                      <td style={{ ...styles.td, fontSize: 11, color: '#475569' }}>{p.paidDate || '—'}</td>
                      {!readOnly && (
                        <td style={styles.td}>
                          {confirmDel === p.id ? (
                            <div style={{ display: 'inline-flex', gap: 4 }}>
                              <span style={{ fontSize: 11, color: '#dc2626', fontWeight: 600 }}>Smazat?</span>
                              <button onClick={() => { onDelete(p.id); setConfirmDel(null); }}
                                style={{ ...styles.iconBtn, color: '#dc2626', background: '#fee2e2' }}><Trash2 size={12} /></button>
                              <button onClick={() => setConfirmDel(null)}
                                style={{ ...styles.iconBtn, color: '#64748b' }}><X size={12} /></button>
                            </div>
                          ) : (
                            <div style={{ display: 'inline-flex', gap: 4 }}>
                              <button onClick={() => setEditing({ payment: p })} style={{ ...styles.iconBtn, padding: '4px 8px' }} title="Upravit">
                                <Edit3 size={12} />
                              </button>
                              <button onClick={() => setConfirmDel(p.id)} style={{ ...styles.iconBtn, padding: '4px 8px' }} title="Smazat">
                                <Trash2 size={12} />
                              </button>
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {editing && (
        <ClientPaymentModal
          payment={editing.payment}
          onSave={(payment) => {
            if (editing.payment) onUpdate(editing.payment.id, payment);
            else onAdd(payment);
            setEditing(null);
          }}
          onClose={() => setEditing(null)}
        />
      )}

      {applyTemplateModal && (
        <ApplyPaymentTemplateModal
          templates={paymentPlanTemplates || []}
          project={project}
          fxRate={fxRate}
          hasExistingPayments={payments.length > 0}
          onApply={(generatedPayments, replaceExisting) => {
            onApplyTemplate(generatedPayments, replaceExisting);
            setApplyTemplateModal(false);
          }}
          onClose={() => setApplyTemplateModal(false)}
        />
      )}
    </div>
  );
}

function PaymentStatCard({ label, amount, color, isTotal }) {
  return (
    <div style={{
      padding: 10, borderRadius: 8, background: '#fff',
      border: `${isTotal ? '2' : '1'}px solid ${isTotal ? color : '#e2e8f0'}`,
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color, marginTop: 4 }}>{fmt(amount)}</div>
    </div>
  );
}

function ClientPaymentModal({ payment, onSave, onClose }) {
  const [label, setLabel] = useState(payment?.label || '');
  const [dueDate, setDueDate] = useState(payment?.dueDate || '');
  const [amount, setAmount] = useState(payment?.amount || '');
  const [currency, setCurrency] = useState(payment?.currency || 'CZK');
  const [status, setStatus] = useState(payment?.status || 'planned');
  const [invoicedDate, setInvoicedDate] = useState(payment?.invoicedDate || '');
  const [paidDate, setPaidDate] = useState(payment?.paidDate || '');
  const [notes, setNotes] = useState(payment?.notes || '');

  const submit = () => {
    if (!amount || parseFloat(amount) <= 0) { alert('Zadejte částku.'); return; }
    onSave({
      label: label.trim(),
      dueDate, amount: parseFloat(amount), currency,
      status,
      invoicedDate: status === 'planned' ? '' : invoicedDate,
      paidDate: status === 'paid' ? paidDate : '',
      notes: notes.trim(),
    });
  };

  return (
    <Modal title={payment ? 'Upravit splátku' : 'Nová splátka od klienta'} onClose={onClose} maxWidth={520}>
      <div style={styles.formRow}>
        <label style={styles.label}>Popis splátky</label>
        <input style={styles.input} value={label} onChange={e => setLabel(e.target.value)}
          placeholder="např. Záloha 30 %, Doplatek po předání..." autoFocus />
      </div>

      <div style={styles.formRowGroup}>
        <div style={{ flex: 2 }}>
          <label style={styles.label}>Datum splatnosti</label>
          <input type="date" style={styles.input} value={dueDate} onChange={e => setDueDate(e.target.value)} />
        </div>
        <div style={{ flex: 2 }}>
          <label style={styles.label}>Částka *</label>
          <input type="number" step="0.01" min="0" style={styles.input} value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Měna</label>
          <select style={styles.input} value={currency} onChange={e => setCurrency(e.target.value)}>
            <option value="CZK">CZK</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
          </select>
        </div>
      </div>

      <div style={styles.formRow}>
        <label style={styles.label}>Status</label>
        <div style={{ display: 'flex', gap: 6 }}>
          {CLIENT_PAYMENT_STATUSES.map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setStatus(s.id);
                if (s.id === 'invoiced' && !invoicedDate) setInvoicedDate(todayISO());
                if (s.id === 'paid' && !paidDate) setPaidDate(todayISO());
              }}
              style={{
                flex: 1, padding: '8px 12px', fontSize: 13, fontWeight: 600,
                border: `2px solid ${status === s.id ? s.color : '#e2e8f0'}`,
                background: status === s.id ? s.bg : '#fff',
                color: status === s.id ? s.color : '#475569',
                borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {(status === 'invoiced' || status === 'paid') && (
        <div style={styles.formRow}>
          <label style={styles.label}>Datum vyfakturování</label>
          <input type="date" style={styles.input} value={invoicedDate} onChange={e => setInvoicedDate(e.target.value)} />
        </div>
      )}

      {status === 'paid' && (
        <div style={styles.formRow}>
          <label style={styles.label}>Datum zaplacení</label>
          <input type="date" style={styles.input} value={paidDate} onChange={e => setPaidDate(e.target.value)} />
        </div>
      )}

      <div style={styles.formRow}>
        <label style={styles.label}>Poznámka</label>
        <input style={styles.input} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Volitelná poznámka..." />
      </div>

      <div style={styles.modalActions}>
        <button style={styles.secondaryBtn} onClick={onClose}>Zrušit</button>
        <button style={styles.primaryBtn} onClick={submit}>{payment ? 'Uložit změny' : 'Vytvořit splátku'}</button>
      </div>
    </Modal>
  );
}

// ==========================================================================
// ApplyPaymentTemplateModal — vybrat šablonu a aplikovat na projekt
// ==========================================================================

function ApplyPaymentTemplateModal({ templates, project, fxRate, hasExistingPayments, onApply, onClose }) {
  // Hodnoty projektu
  const itemsCostSum = useMemo(() => computeProjectTotal(project, fxRate), [project, fxRate]);
  const contractNet = parseFloat(project?.contractValue) || 0;
  const vatRate = parseFloat(project?.vatRate) || 0;
  const contractGross = contractNet * (1 + vatRate / 100);
  const hasContractValue = contractNet > 0;

  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0]?.id || '');
  const [startDate, setStartDate] = useState(todayISO());
  const [overrideTotal, setOverrideTotal] = useState(false);
  const [customTotal, setCustomTotal] = useState(contractGross || itemsCostSum);
  const [replaceExisting, setReplaceExisting] = useState(false);
  const [milestoneDates, setMilestoneDates] = useState({});

  const selectedTemplate = useMemo(
    () => templates.find(t => t.id === selectedTemplateId),
    [templates, selectedTemplateId]
  );

  useEffect(() => {
    setMilestoneDates({});
  }, [selectedTemplateId]);

  const milestones = useMemo(() => {
    if (!selectedTemplate) return [];
    return selectedTemplate.installments.map((inst, idx) => ({ inst, idx }));
  }, [selectedTemplate]);

  // Výchozí: hodnota smlouvy s DPH (klient zaplatí)
  const effectiveTotal = overrideTotal ? (parseFloat(customTotal) || 0) : contractGross;

  const generated = useMemo(() => {
    if (!selectedTemplate) return [];
    return applyPaymentTemplate(selectedTemplate, effectiveTotal, startDate, milestoneDates);
  }, [selectedTemplate, effectiveTotal, startDate, milestoneDates]);

  const generatedTotal = useMemo(() => generated.reduce((s, p) => s + p.amount, 0), [generated]);
  const difference = effectiveTotal - generatedTotal;

  const submit = () => {
    if (generated.length === 0) { alert('Šablona neobsahuje žádné splátky.'); return; }
    if (effectiveTotal <= 0) { alert('Hodnota projektu musí být vyšší než 0. Přidejte do projektu položky nebo zadejte vlastní hodnotu.'); return; }
    onApply(generated, replaceExisting);
  };

  return (
    <Modal title="Použít šablonu platebního plánu" onClose={onClose} maxWidth={680}>
      {/* Výběr šablony */}
      <div style={styles.formRow}>
        <label style={styles.label}>Šablona *</label>
        <select style={styles.input} value={selectedTemplateId} onChange={e => setSelectedTemplateId(e.target.value)}>
          {templates.map(t => (
            <option key={t.id} value={t.id}>{t.name} ({t.installments?.length || 0} splátek)</option>
          ))}
        </select>
        {selectedTemplate?.description && (
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4, fontStyle: 'italic' }}>
            {selectedTemplate.description}
          </div>
        )}
      </div>

      {/* Hodnota projektu */}
      <div style={{ marginTop: 12, padding: 12, background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#166534', marginBottom: 8 }}>
          💰 Hodnota smlouvy (pro platební plán)
        </div>
        {hasContractValue ? (
          <div style={{ background: '#fff', padding: 8, borderRadius: 6, border: '1px solid #bbf7d0', fontSize: 12, color: '#0d3825', marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Hodnota smlouvy bez DPH:</span>
              <strong>{fmt(contractNet)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
              <span>DPH ({vatRate} %):</span>
              <strong>{fmt(contractGross - contractNet)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, paddingTop: 4, borderTop: '1px solid #bbf7d0', fontSize: 13 }}>
              <span><strong>Klient zaplatí (s DPH):</strong></span>
              <strong style={{ color: '#15803d' }}>{fmt(contractGross)}</strong>
            </div>
            <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 6, paddingTop: 4, borderTop: '1px solid #f1f5f9' }}>
              Pro porovnání — náklady (součet položek): {fmt(itemsCostSum)}
            </div>
          </div>
        ) : (
          <div style={{ padding: 8, background: '#fef3c7', borderRadius: 6, border: '1px solid #fcd34d', fontSize: 12, color: '#92400e', marginBottom: 8 }}>
            ⚠ Projekt nemá zadanou hodnotu smlouvy. Otevřete <strong>Upravit projekt</strong> a doplňte ji, nebo použijte vlastní hodnotu níže.
          </div>
        )}
        <label style={{ fontSize: 11, color: '#475569', display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
          <input type="checkbox" checked={overrideTotal} onChange={e => setOverrideTotal(e.target.checked)} />
          Použít jinou hodnotu pro tento platební plán
        </label>
        {overrideTotal && (
          <div style={{ marginTop: 6 }}>
            <label style={styles.label}>Vlastní hodnota (CZK, použije se přímo jako celková částka)</label>
            <input type="number" step="0.01" min="0" style={styles.input} value={customTotal} onChange={e => setCustomTotal(e.target.value)} />
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
              Toto číslo se nepřevádí DPH — zadejte přesnou částku, kterou má klient zaplatit.
            </div>
          </div>
        )}
      </div>

      {/* Výchozí datum */}
      <div style={styles.formRow}>
        <label style={styles.label}>Výchozí datum</label>
        <input type="date" style={styles.input} value={startDate} onChange={e => setStartDate(e.target.value)} />
        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
          Použije se pro milníky, u kterých nezadáte konkrétní datum. Typicky datum podpisu smlouvy.
        </div>
      </div>

      {/* Datumy milníků */}
      {milestones.length > 0 && (
        <div style={{ marginTop: 12, padding: 12, background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#166534', marginBottom: 6 }}>
            🚩 Datumy milníků ({milestones.length})
          </div>
          <div style={{ fontSize: 11, color: '#166534', marginBottom: 10 }}>
            Zadejte plánovaná data pro každý milník. Splatnost splátky = datum milníku + počet dní z šablony.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {milestones.map(({ inst, idx }) => (
              <div key={idx} style={{
                display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 8, alignItems: 'center',
                padding: 8, background: '#fff', border: '1px solid #bbf7d0', borderRadius: 6,
              }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{inst.label || `Milník #${idx + 1}`}</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>
                    Splatnost: {inst.dueDateOffsetDays > 0 ? `milník + ${inst.dueDateOffsetDays} dní` : 'v den milníku'}
                  </div>
                </div>
                <input
                  type="date"
                  style={{ ...styles.input, padding: '6px 8px', fontSize: 12, width: 150 }}
                  value={milestoneDates[idx] || ''}
                  onChange={e => setMilestoneDates({ ...milestoneDates, [idx]: e.target.value })}
                  placeholder="Datum milníku"
                />
                {!milestoneDates[idx] ? (
                  <span style={{ fontSize: 10, color: '#f59e0b', fontWeight: 600 }} title="Pokud datum nezadáte, použije se výchozí datum">
                    fallback
                  </span>
                ) : (
                  <span style={{ fontSize: 10, color: '#10b981', fontWeight: 600 }}>✓</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Náhled generovaných splátek */}
      <h3 style={{ margin: '14px 0 8px', fontSize: 14 }}>Náhled splátek</h3>
      {generated.length === 0 ? (
        <div style={{ padding: 20, textAlign: 'center', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, color: '#991b1b', fontSize: 13 }}>
          Šablona neobsahuje splátky nebo je hodnota projektu nulová.
        </div>
      ) : (
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, overflow: 'auto', maxHeight: 280 }}>
          <table style={{ ...styles.table, fontSize: 11 }}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Popis</th>
                <th style={styles.th}>Splatnost</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Částka</th>
              </tr>
            </thead>
            <tbody>
              {generated.map((p, idx) => (
                <tr key={idx} style={styles.tr}>
                  <td style={{ ...styles.td, color: '#94a3b8' }}>{idx + 1}.</td>
                  <td style={styles.td}>{p.label}</td>
                  <td style={styles.td}>{p.dueDate}</td>
                  <td style={{ ...styles.td, textAlign: 'right', fontWeight: 600 }}>{fmt(p.amount)}</td>
                </tr>
              ))}
              <tr style={{ background: '#0d3825', color: '#fff' }}>
                <td colSpan={3} style={{ ...styles.td, fontWeight: 700, color: '#fff' }}>CELKEM splátek</td>
                <td style={{ ...styles.td, textAlign: 'right', fontWeight: 700, color: '#fff' }}>{fmt(generatedTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Varování o rozdílu */}
      {Math.abs(difference) > 0.5 && generated.length > 0 && (
        <div style={{ marginTop: 10, padding: 10, background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 6, fontSize: 12, color: '#92400e' }}>
          ⚠ Rozdíl mezi hodnotou projektu ({fmt(effectiveTotal)}) a součtem splátek ({fmt(generatedTotal)}): <strong>{fmt(Math.abs(difference))} {difference > 0 ? '(splátky nepokrývají celou hodnotu)' : '(splátky překračují hodnotu)'}</strong>
          {difference > 0 && !selectedTemplate?.installments?.some(i => i.type === 'recurring') && (
            <div style={{ marginTop: 4 }}>Šablona nemá recurring splátku, která by zbytek pokryla.</div>
          )}
        </div>
      )}

      {/* Replace existing checkbox */}
      {hasExistingPayments && (
        <div style={{ marginTop: 10, padding: 10, background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 6, fontSize: 12, color: '#991b1b' }}>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            <input type="checkbox" checked={replaceExisting} onChange={e => setReplaceExisting(e.target.checked)} />
            <strong>Nahradit stávající splátky</strong> (smaže {hasExistingPayments ? 'všechny existující splátky' : 'splátky'})
          </label>
          {!replaceExisting && (
            <div style={{ marginTop: 4, color: '#7f1d1d' }}>
              Pokud necháte nezaškrtnuté, nové splátky se přidají k existujícím.
            </div>
          )}
        </div>
      )}

      <div style={styles.modalActions}>
        <button style={styles.secondaryBtn} onClick={onClose}>Zrušit</button>
        <button style={styles.primaryBtn} onClick={submit} disabled={generated.length === 0}>
          <CheckCircle2 size={14} /> Aplikovat {generated.length} {generated.length === 1 ? 'splátku' : generated.length < 5 ? 'splátky' : 'splátek'}
        </button>
      </div>
    </Modal>
  );
}

function ItemsTable({ items, categories, suppliers, exchangeRate, readOnly, onEdit, onDelete }) {
  const [sortBy, setSortBy] = useState('category');
  const sorted = useMemo(() => {
    const copy = [...items];
    if (sortBy === 'category') copy.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
    else if (sortBy === 'status') copy.sort((a, b) => STATUS_ORDER.indexOf(a.status || 'planned') - STATUS_ORDER.indexOf(b.status || 'planned'));
    else if (sortBy === 'date') copy.sort((a, b) => {
      const da = a.purchaseDate || a.plannedOrderDate || 'z';
      const db = b.purchaseDate || b.plannedOrderDate || 'z';
      return da.localeCompare(db);
    });
    else if (sortBy === 'amount') copy.sort((a, b) => toCZK(b, exchangeRate) - toCZK(a, exchangeRate));
    return copy;
  }, [items, sortBy, exchangeRate]);

  return (
    <>
      <div style={{ display: 'flex', gap: 6, marginBottom: 10, fontSize: 12, flexWrap: 'wrap' }}>
        <span style={{ color: '#64748b', alignSelf: 'center' }}>Řadit:</span>
        {['category', 'status', 'date', 'amount'].map(s => (
          <button key={s} onClick={() => setSortBy(s)} style={sortBy === s ? styles.sortBtnActive : styles.sortBtn}>{s}</button>
        ))}
      </div>
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Stav</th>
              <th style={styles.th}>Kategorie</th>
              <th style={styles.th}>Položka</th>
              <th style={styles.th}>Dodavatel</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Množ.</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Celkem</th>
              <th style={styles.th}>Objednávka</th>
              <th style={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(item => {
              const cat = categories.find(c => c.id === item.category);
              const sup = suppliers.find(s => s.id === item.supplierId);
              const supName = sup?.name || item.supplier || '';
              const czk = toCZK(item, exchangeRate);
              return (
                <tr key={item.id} style={styles.tr}>
                  <td style={styles.td}>
                    <StatusPill
                      status={item.status || 'planned'}
                      isInvoiced={item.isInvoiced}
                      readOnly={true}
                      onChangeInvoiced={() => {}}
                    />
                  </td>
                  <td style={styles.td}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: cat?.color || '#94a3b8' }} />
                      <span style={{ fontSize: 12, color: '#64748b' }}>{cat?.name || 'Neznámé'}</span>
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={{ fontWeight: 500 }}>
                      {item.name}
                      {item.catalogId && <span style={{ marginLeft: 6, fontSize: 10, padding: '1px 5px', borderRadius: 3, background: '#dbeafe', color: '#1d4ed8', fontWeight: 700 }}>cat.</span>}
                      {item.fromStockItemId && <span style={{ marginLeft: 6, fontSize: 10, padding: '1px 5px', borderRadius: 3, background: '#fef3c7', color: '#92400e', fontWeight: 700 }} title="Položka pochází ze skladu (byla spotřebována ze zásoby)">📦 ze skladu</span>}
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                      {item.quantity} {item.unit} × {fmt2(item.unitPrice, item.currency || 'CZK')}
                    </div>
                  </td>
                  <td style={{ ...styles.td, color: '#64748b' }}>
                    <div>{supName || '—'}</div>
                    {sup && (sup.depositPercent > 0 || sup.paymentTermsDays != null) && (
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                        {sup.depositPercent > 0 && `${sup.depositPercent}% dep, `}Net {sup.paymentTermsDays ?? 0}
                      </div>
                    )}
                  </td>
                  <td style={{ ...styles.td, textAlign: 'right' }}>{item.quantity} {item.unit}</td>
                  <td style={{ ...styles.td, textAlign: 'right', fontWeight: 600 }}>{fmt(czk)}</td>
                  <td style={{ ...styles.td, fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' }}>
                    {item.purchaseDate ? (
                      <div>
                        <div>{item.purchaseDate}</div>
                        {item.orderNumber && <div style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'monospace' }}>#{item.orderNumber}</div>}
                      </div>
                    ) : item.plannedOrderDate ? (
                      <div>
                        <div style={{ color: '#94a3b8', fontStyle: 'italic' }}>{item.plannedOrderDate}</div>
                        <div style={{ fontSize: 10, color: '#94a3b8' }}>plánováno</div>
                      </div>
                    ) : (
                      <span style={{ color: '#cbd5e1' }}>—</span>
                    )}
                  </td>
                  <td style={styles.td}>
                    {!readOnly && (
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                        <button style={styles.iconBtn} onClick={() => onEdit(item)}><Edit3 size={14} /></button>
                        <button style={styles.iconBtn} onClick={() => onDelete(item.id)}><Trash2 size={14} /></button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function SummaryCard({ label, value, accent, icon, onClick }) {
  return (
    <div
      style={{ ...styles.summaryCard, cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <div style={styles.summaryLabel}>{label}</div>
      <div style={{ ...styles.summaryValue, color: accent, display: 'flex', alignItems: 'center', gap: 6 }}>{icon}{value}</div>
    </div>
  );
}

// ==========================================================================
// Purchase List — ONLY planned (unordered) items
// ==========================================================================

function PurchaseListView({ projects, categories, suppliers, fxRate, focusKey, readOnly, onUpdateItem, onBatchUpdate }) {
  const [groupBy, setGroupBy] = useState('supplier');
  const [selected, setSelected] = useState(() => new Set());
  const [orderModal, setOrderModal] = useState(null);
  const [bulkSupplierModal, setBulkSupplierModal] = useState(null); // { rows: [...] }
  const [bulkDatesModal, setBulkDatesModal] = useState(null); // { rows: [...] }
  const [quickSupplier, setQuickSupplier] = useState(null); // row for which to assign supplier
  const [priceEdit, setPriceEdit] = useState(null); // row for which to edit price
  const [query, setQuery] = useState('');
  const [filterSupplier, setFilterSupplier] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterProject, setFilterProject] = useState('all');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const allItems = useMemo(() => {
    const out = [];
    projects.forEach(p => {
      p.items.forEach(i => {
        if ((i.status || 'planned') !== 'planned') return; // ONLY planned
        const cat = categories.find(c => c.id === i.category);
        const sup = suppliers.find(s => s.id === i.supplierId);
        out.push({
          key: `${p.id}:${i.id}`, projectId: p.id, projectName: p.name, projectClient: p.client || '',
          item: i, category: cat, supplier: sup,
          supplierName: sup?.name || i.supplier || '',
          hasSupplier: !!(sup || (i.supplier && i.supplier.trim())),
          czk: toCZK(i, fxRate),
        });
      });
    });
    return out;
  }, [projects, categories, suppliers, fxRate]);

  const filteredItems = useMemo(() => {
    return allItems.filter(r => {
      // Filter: supplier
      if (filterSupplier !== 'all') {
        if (filterSupplier === '__nosupplier__') {
          if (r.hasSupplier) return false;
        } else if (r.supplier?.id !== filterSupplier) {
          return false;
        }
      }
      // Filter: category
      if (filterCategory !== 'all' && r.category?.id !== filterCategory) return false;
      // Filter: project
      if (filterProject !== 'all' && r.projectId !== filterProject) return false;
      // Fulltext (vč. jména klienta)
      if (query.trim()) {
        if (!searchMatch(query, [
          r.item.name, r.item.notes, r.item.unit,
          r.supplierName, r.projectName, r.projectClient, r.category?.name,
          r.item.orderNumber, r.item.plannedOrderDate, r.item.plannedDeliveryDate,
        ])) return false;
      }
      return true;
    });
  }, [allItems, query, filterSupplier, filterCategory, filterProject]);

  const activeFilters = (filterSupplier !== 'all' ? 1 : 0) + (filterCategory !== 'all' ? 1 : 0) + (filterProject !== 'all' ? 1 : 0);

  // Focus/scroll/highlight když přijdeme z dashboardu
  const rowRefs = useRef({});
  const focusedKey = focusKey ? `${focusKey.projectId}:${focusKey.itemId}` : null;
  useEffect(() => {
    if (!focusKey) return;
    // Skok z projektu s filtrem — nastavíme filter na daný projekt
    if (focusKey.filterProjectId) {
      setFilterProject(focusKey.filterProjectId);
      setQuery('');
      setFilterSupplier('all');
      setFilterCategory('all');
      setFiltersOpen(true);
      return;
    }
    const key = `${focusKey.projectId}:${focusKey.itemId}`;
    // Scroll to row after render
    const t = setTimeout(() => {
      const el = rowRefs.current[key];
      if (el && el.scrollIntoView) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
    return () => clearTimeout(t);
  }, [focusKey?.ts]);

  const grouped = useMemo(() => {
    const map = new Map();
    filteredItems.forEach(r => {
      let key, label, sublabel;
      if (groupBy === 'supplier') {
        key = r.supplier?.id || (r.hasSupplier ? `free_${r.supplierName}` : '__nosupplier__');
        label = r.hasSupplier ? r.supplierName : '⚠ Bez přiřazeného dodavatele';
      } else if (groupBy === 'category') { key = r.category?.id || 'unknown'; label = r.category?.name || 'Neznámé'; }
      else {
        key = r.projectId;
        label = r.projectName;
        sublabel = r.projectClient || ''; // jméno klienta jako podtitulek
      }
      if (!map.has(key)) map.set(key, { key, label, sublabel: sublabel || '', rows: [], total: 0, isNoSupplier: key === '__nosupplier__' });
      const g = map.get(key);
      g.rows.push(r); g.total += r.czk;
    });
    const out = Array.from(map.values());
    // Put "Bez dodavatele" group at top if grouped by supplier
    out.sort((a, b) => {
      if (a.isNoSupplier) return -1;
      if (b.isNoSupplier) return 1;
      return a.label.localeCompare(b.label);
    });
    out.forEach(g => g.rows.sort((a, b) => {
      const catCmp = (a.category?.name || '').localeCompare(b.category?.name || '');
      if (catCmp !== 0) return catCmp;
      return a.projectName.localeCompare(b.projectName);
    }));
    return out;
  }, [filteredItems, groupBy]);

  const toggleRow = (key) => {
    const next = new Set(selected);
    if (next.has(key)) next.delete(key); else next.add(key);
    setSelected(next);
  };
  const toggleGroup = (groupRows) => {
    const next = new Set(selected);
    const keys = groupRows.map(r => r.key);
    const allSelected = keys.every(k => next.has(k));
    if (allSelected) keys.forEach(k => next.delete(k));
    else keys.forEach(k => next.add(k));
    setSelected(next);
  };

  const selectedRows = allItems.filter(r => selected.has(r.key));
  const selectedTotal = selectedRows.reduce((s, r) => s + r.czk, 0);
  const selectedMissingSupplier = selectedRows.filter(r => !r.hasSupplier);

  const openOrderModal = () => {
    if (selectedMissingSupplier.length > 0) {
      alert(`${selectedMissingSupplier.length} vybraných položek zatím nemá přiřazeného dodavatele. Před označením jako objednané přiřaďte ke každé dodavatele (klikněte na „Nastavit dodavatele" na řádku).`);
      return;
    }
    setOrderModal({ rows: selectedRows });
  };

  if (projects.length === 0) return <EmptyState onCreate={() => {}} />;

  return (
    <main style={styles.main}>
      <div style={styles.mainHeader}>
        <div>
          <h2 style={styles.projectTitle}>Nákupní seznam</h2>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>
            Položky plánované napříč všemi projekty, které ještě nebyly objednány. Vyberte položky → „Označit jako objednané" pro vytvoření objednávky.
          </p>
        </div>
      </div>

      <div style={styles.searchBar}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <SearchInput value={query} onChange={setQuery} placeholder="Hledat název, dodavatele, projekt, klienta, číslo objednávky..." />
        </div>
        <button
          style={filtersOpen || activeFilters > 0 ? { ...styles.sortBtnActive, padding: '7px 12px' } : { ...styles.sortBtn, padding: '7px 12px' }}
          onClick={() => setFiltersOpen(v => !v)}
        >
          <Filter size={13} /> Filtry {activeFilters > 0 && <span style={{ padding: '0 6px', background: '#fff', color: '#0d3825', borderRadius: 999, fontSize: 10, fontWeight: 700, marginLeft: 4 }}>{activeFilters}</span>}
        </button>
        {(query || activeFilters > 0) && (
          <button
            style={{ ...styles.sortBtn, padding: '7px 12px' }}
            onClick={() => { setQuery(''); setFilterSupplier('all'); setFilterCategory('all'); setFilterProject('all'); }}
          >Vymazat vše</button>
        )}
        <div style={{ fontSize: 12, color: '#64748b', marginLeft: 'auto' }}>
          {filteredItems.length} / {allItems.length} položek
        </div>
      </div>

      {filtersOpen && (
        <div style={styles.filterPanel}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            <div>
              <label style={styles.label}>Dodavatel</label>
              <select style={styles.input} value={filterSupplier} onChange={e => setFilterSupplier(e.target.value)}>
                <option value="all">Všichni</option>
                <option value="__nosupplier__">⚠ Bez dodavatele</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label style={styles.label}>Kategorie</label>
              <select style={styles.input} value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                <option value="all">Všechny</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={styles.label}>Projekt</label>
              <select style={styles.input} value={filterProject} onChange={e => setFilterProject(e.target.value)}>
                <option value="all">Všechny</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      <div style={styles.cfControls}>
        <div>
          <div style={styles.label}>Seskupit podle</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button onClick={() => setGroupBy('supplier')} style={groupBy === 'supplier' ? styles.sortBtnActive : styles.sortBtn}>Dodavatel</button>
            <button onClick={() => setGroupBy('category')} style={groupBy === 'category' ? styles.sortBtnActive : styles.sortBtn}>Kategorie</button>
            <button onClick={() => setGroupBy('project')} style={groupBy === 'project' ? styles.sortBtnActive : styles.sortBtn}>Projekt</button>
          </div>
        </div>
      </div>

      {!readOnly && selected.size > 0 && (
        <div style={styles.actionBar}>
          <div><strong>{selected.size}</strong> vybráno · <strong>{fmt(selectedTotal)}</strong>
            {selectedMissingSupplier.length > 0 && (
              <span style={{ marginLeft: 10, padding: '2px 8px', background: '#dc2626', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                ⚠ {selectedMissingSupplier.length} bez dodavatele
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button style={styles.sortBtn} onClick={() => setSelected(new Set())}>Vymazat</button>
            <button style={styles.sortBtn} onClick={() => {
              const rows = filteredItems.filter(r => selected.has(r.key));
              if (rows.length === 0) return;
              setBulkSupplierModal({ rows });
            }}>
              <Users size={14} /> Nastavit dodavatele
            </button>
            <button style={styles.sortBtn} onClick={() => {
              const rows = filteredItems.filter(r => selected.has(r.key));
              if (rows.length === 0) return;
              setBulkDatesModal({ rows });
            }}>
              <Calendar size={14} /> Nastavit datumy
            </button>
            <button style={styles.primaryBtn} onClick={openOrderModal}>
              <ShoppingCart size={14} /> Mark ordered →
            </button>
          </div>
        </div>
      )}

      {grouped.length === 0 ? (
        <div style={styles.emptyItems}>
          <CheckCircle2 size={32} style={{ color: '#10b981' }} />
          <p style={{ color: '#64748b', margin: '12px 0 0' }}>Není co objednat — všechny plánované položky byly zpracovány.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {grouped.map(g => {
            const keys = g.rows.map(r => r.key);
            const allSel = keys.every(k => selected.has(k));
            const someSel = !allSel && keys.some(k => selected.has(k));
            return (
              <div key={g.key}>
                <div style={{ ...styles.groupHeader, background: g.isNoSupplier ? '#fef3c7' : 'transparent', borderRadius: 6, padding: '8px 12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                    <input type="checkbox" checked={allSel} ref={el => { if (el) el.indeterminate = someSel; }} onChange={() => toggleGroup(g.rows)} />
                    <span style={{ fontSize: 15, fontWeight: 700, color: g.isNoSupplier ? '#92400e' : '#0f172a' }}>
                      {g.label}
                      {g.sublabel && (
                        <span style={{ fontSize: 12, fontWeight: 500, color: '#64748b', marginLeft: 8 }}>· {g.sublabel}</span>
                      )}
                    </span>
                    <span style={styles.groupMeta}>{g.rows.length} položek · {fmt(g.total)}</span>
                  </label>
                </div>
                <div style={styles.tableWrap}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={{ ...styles.th, width: 36 }}></th>
                        {groupBy !== 'supplier' && <th style={styles.th}>Dodavatel</th>}
                        {groupBy !== 'category' && <th style={styles.th}>Kategorie</th>}
                        {groupBy !== 'project' && <th style={styles.th}>Projekt</th>}
                        <th style={styles.th}>Položka</th>
                        <th style={{ ...styles.th, textAlign: 'right' }}>Celkem</th>
                        <th style={styles.th}>Plán. objednávka</th>
                        <th style={styles.th}>Plán. dodání</th>
                        <th style={{ ...styles.th, width: 60 }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {g.rows.map(r => {
                        const isSel = selected.has(r.key);
                        const isFocused = focusedKey === r.key;
                        return (
                          <tr
                            key={r.key}
                            ref={el => { if (el) rowRefs.current[r.key] = el; }}
                            style={{
                              ...styles.tr,
                              background: isFocused ? '#fde68a' : (isSel ? '#fef3c7' : 'transparent'),
                              boxShadow: isFocused ? 'inset 3px 0 0 #f59e0b' : 'none',
                              transition: 'background 0.3s',
                            }}
                          >
                            <td style={styles.td}><input type="checkbox" checked={isSel} onChange={() => toggleRow(r.key)} disabled={readOnly} /></td>
                            {groupBy !== 'supplier' && (
                              <td style={{ ...styles.td, color: '#64748b' }}>
                                {r.hasSupplier ? r.supplierName : (
                                  readOnly ? (
                                    <span style={{ color: '#dc2626', fontSize: 11 }}>⚠ bez dodavatele</span>
                                  ) : (
                                    <button style={{ ...styles.sortBtn, color: '#dc2626', borderColor: '#fca5a5' }}
                                      onClick={() => setQuickSupplier(r)}>⚠ Nastavit dodavatele</button>
                                  )
                                )}
                              </td>
                            )}
                            {groupBy !== 'category' && (
                              <td style={styles.td}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: r.category?.color || '#94a3b8' }} />
                                  <span style={{ fontSize: 12, color: '#64748b' }}>{r.category?.name}</span>
                                </span>
                              </td>
                            )}
                            {groupBy !== 'project' && (
                              <td style={{ ...styles.td, fontSize: 12, color: '#475569' }}>
                                <div>{r.projectName}</div>
                                {r.projectClient && (
                                  <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>{r.projectClient}</div>
                                )}
                              </td>
                            )}
                            <td style={styles.td}>
                              <div style={{ fontWeight: 500 }}>{r.item.name}</div>
                              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span>{r.item.quantity} {r.item.unit} × {fmt2(r.item.unitPrice, r.item.currency || 'CZK')}</span>
                                {!readOnly && (
                                  <button
                                    type="button"
                                    onClick={() => setPriceEdit(r)}
                                    style={{ padding: '1px 6px', fontSize: 10, borderRadius: 4, border: '1px solid #cbd5e1', background: '#fff', color: '#64748b', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 3 }}
                                    title="Upravit množství a cenu"
                                  ><Edit3 size={10} /> cena</button>
                                )}
                              </div>
                            </td>
                            <td style={{ ...styles.td, textAlign: 'right', fontWeight: 600 }}>{fmt(r.czk)}</td>
                            <td style={styles.td}>
                              {readOnly ? (
                                <span style={{ fontSize: 12, color: '#475569' }}>{r.item.plannedOrderDate || '—'}</span>
                              ) : (
                                <input type="date" style={{ ...styles.input, padding: '4px 8px', fontSize: 12, width: 140 }}
                                  value={r.item.plannedOrderDate || ''}
                                  onChange={e => onUpdateItem(r.projectId, r.item.id, { plannedOrderDate: e.target.value })} />
                              )}
                            </td>
                            <td style={styles.td}>
                              {readOnly ? (
                                <span style={{ fontSize: 12, color: '#475569' }}>{r.item.plannedDeliveryDate || '—'}</span>
                              ) : (
                                <input type="date" style={{ ...styles.input, padding: '4px 8px', fontSize: 12, width: 140 }}
                                  value={r.item.plannedDeliveryDate || ''}
                                  onChange={e => onUpdateItem(r.projectId, r.item.id, { plannedDeliveryDate: e.target.value })} />
                              )}
                            </td>
                            <td style={styles.td}>
                              {!readOnly && g.isNoSupplier && (
                                <button style={styles.sortBtn} onClick={() => setQuickSupplier(r)}>Nastavit dodavatele</button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {orderModal && (
        <OrderBatchModal rows={orderModal.rows} suppliers={suppliers}
          onConfirm={(updates) => {
            onBatchUpdate(updates);
            setSelected(new Set()); setOrderModal(null);
          }} onClose={() => setOrderModal(null)} />
      )}

      {bulkSupplierModal && (
        <BulkSupplierModal
          rows={bulkSupplierModal.rows}
          suppliers={suppliers}
          onConfirm={(supplierId, supplierFreeText) => {
            const patch = supplierId
              ? { supplierId, supplier: '' }
              : { supplierId: '', supplier: supplierFreeText };
            const updates = bulkSupplierModal.rows.map(r => ({
              projectId: r.projectId, itemId: r.item.id, patch,
            }));
            onBatchUpdate(updates);
            setSelected(new Set());
            setBulkSupplierModal(null);
          }}
          onClose={() => setBulkSupplierModal(null)}
        />
      )}

      {bulkDatesModal && (
        <BulkDatesModal
          rows={bulkDatesModal.rows}
          onConfirm={(plannedOrderDate, plannedDeliveryDate) => {
            // Aplikovat jen ta pole, která byla zadána (null = nezměnit)
            const patch = {};
            if (plannedOrderDate !== null) patch.plannedOrderDate = plannedOrderDate;
            if (plannedDeliveryDate !== null) patch.plannedDeliveryDate = plannedDeliveryDate;
            if (Object.keys(patch).length === 0) {
              setBulkDatesModal(null);
              return;
            }
            const updates = bulkDatesModal.rows.map(r => ({
              projectId: r.projectId, itemId: r.item.id, patch,
            }));
            onBatchUpdate(updates);
            setSelected(new Set());
            setBulkDatesModal(null);
          }}
          onClose={() => setBulkDatesModal(null)}
        />
      )}

      {quickSupplier && (
        <QuickSupplierModal row={quickSupplier} suppliers={suppliers}
          onSave={(patch) => { onUpdateItem(quickSupplier.projectId, quickSupplier.item.id, patch); setQuickSupplier(null); }}
          onClose={() => setQuickSupplier(null)} />
      )}

      {priceEdit && (
        <QuickPriceModal row={priceEdit} fxRate={fxRate}
          onSave={(patch) => { onUpdateItem(priceEdit.projectId, priceEdit.item.id, patch); setPriceEdit(null); }}
          onClose={() => setPriceEdit(null)} />
      )}
    </main>
  );
}

// ==========================================================================
// Quick Supplier assignment modal
// ==========================================================================

function QuickSupplierModal({ row, suppliers, onSave, onClose }) {
  const [supplierId, setSupplierId] = useState(row.item.supplierId || '');
  const [freeText, setFreeText] = useState(row.item.supplier || '');

  const submit = () => {
    if (supplierId) onSave({ supplierId, supplier: '' });
    else if (freeText.trim()) onSave({ supplierId: '', supplier: freeText.trim() });
    else onClose();
  };

  return (
    <Modal title="Přiřadit dodavatele" onClose={onClose} maxWidth={480}>
      <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 12px' }}>
        Položka: <strong>{row.item.name}</strong> ({row.projectName})
      </p>
      <div style={styles.formRow}>
        <label style={styles.label}>Ze seznamu dodavatelů</label>
        <select style={styles.input} value={supplierId} onChange={e => setSupplierId(e.target.value)} autoFocus>
          <option value="">— Vyberte dodavatele —</option>
          {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', margin: '10px 0' }}>— nebo —</div>
      <div style={styles.formRow}>
        <label style={styles.label}>Vlastní název dodavatele</label>
        <input style={styles.input} value={freeText} onChange={e => { setFreeText(e.target.value); if (e.target.value) setSupplierId(''); }} placeholder="Název dodavatele" />
        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Použijte, pokud dodavatel ještě není ve vašem registru.</div>
      </div>
      <div style={styles.modalActions}>
        <button style={styles.secondaryBtn} onClick={onClose}>Zrušit</button>
        <button style={styles.primaryBtn} onClick={submit}>Přiřadit</button>
      </div>
    </Modal>
  );
}

// ==========================================================================
// Bulk Supplier modal — přiřadit jednoho dodavatele více položkám najednou
// ==========================================================================

function BulkSupplierModal({ rows, suppliers, onConfirm, onClose }) {
  const [supplierId, setSupplierId] = useState('');
  const [freeText, setFreeText] = useState('');

  // Statistiky o aktuálních dodavatelích vybraných položek
  const currentStats = useMemo(() => {
    const map = new Map();
    rows.forEach(r => {
      const label = r.hasSupplier ? r.supplierName : '⚠ Bez dodavatele';
      map.set(label, (map.get(label) || 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [rows]);

  const willOverwrite = rows.filter(r => r.hasSupplier).length;

  const submit = () => {
    if (supplierId) {
      onConfirm(supplierId, '');
    } else if (freeText.trim()) {
      onConfirm('', freeText.trim());
    } else {
      alert('Vyberte dodavatele nebo zadejte vlastní název.');
    }
  };

  return (
    <Modal title={`Nastavit dodavatele pro ${rows.length} ${rows.length === 1 ? 'položku' : rows.length < 5 ? 'položky' : 'položek'}`} onClose={onClose} maxWidth={520}>
      <div style={{ marginBottom: 14, padding: 10, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, fontSize: 12, color: '#166534' }}>
        Vybráno <strong>{rows.length}</strong> {rows.length === 1 ? 'položka' : 'položek'}. Aktuálně:
        <ul style={{ margin: '6px 0 0', paddingLeft: 20 }}>
          {currentStats.map(([label, count]) => (
            <li key={label}>{label} — <strong>{count}</strong></li>
          ))}
        </ul>
        {willOverwrite > 0 && (
          <div style={{ marginTop: 8, color: '#92400e', fontWeight: 600 }}>
            ⚠ U {willOverwrite} {willOverwrite === 1 ? 'položky' : willOverwrite < 5 ? 'položek' : 'položek'} se přepíše stávající dodavatel.
          </div>
        )}
      </div>

      <div style={styles.formRow}>
        <label style={styles.label}>Ze seznamu dodavatelů</label>
        <select style={styles.input} value={supplierId} onChange={e => {
          setSupplierId(e.target.value);
          if (e.target.value) setFreeText('');
        }} autoFocus>
          <option value="">— Vyberte dodavatele —</option>
          {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', margin: '10px 0' }}>— nebo —</div>

      <div style={styles.formRow}>
        <label style={styles.label}>Vlastní název dodavatele</label>
        <input style={styles.input} value={freeText} onChange={e => {
          setFreeText(e.target.value);
          if (e.target.value) setSupplierId('');
        }} placeholder="Název dodavatele" />
        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
          Použijte, pokud dodavatel ještě není ve vašem registru.
        </div>
      </div>

      <div style={{ maxHeight: 200, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: 6, marginTop: 12 }}>
        <table style={{ ...styles.table, fontSize: 11 }}>
          <thead>
            <tr>
              <th style={styles.th}>Položka</th>
              <th style={styles.th}>Projekt</th>
              <th style={styles.th}>Aktuální dodavatel</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.key} style={styles.tr}>
                <td style={styles.td}>{r.item.name}</td>
                <td style={{ ...styles.td, fontSize: 10, color: '#64748b' }}>{r.projectName}</td>
                <td style={{ ...styles.td, fontSize: 10, color: r.hasSupplier ? '#475569' : '#dc2626' }}>
                  {r.hasSupplier ? r.supplierName : '— žádný —'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.modalActions}>
        <button style={styles.secondaryBtn} onClick={onClose}>Zrušit</button>
        <button style={styles.primaryBtn} onClick={submit}>
          <Users size={14} /> Přiřadit všem
        </button>
      </div>
    </Modal>
  );
}

// ==========================================================================
// Bulk Dates modal — hromadné nastavení plánovaných datumů
// ==========================================================================

function BulkDatesModal({ rows, onConfirm, onClose }) {
  const [orderDate, setOrderDate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [setOrder, setSetOrder] = useState(true);
  const [setDelivery, setSetDelivery] = useState(true);
  // Mód "Vymazat" - nastavuje pole na prázdné
  const [clearOrder, setClearOrder] = useState(false);
  const [clearDelivery, setClearDelivery] = useState(false);

  // Statistiky o aktuálních datumech vybraných položek
  const stats = useMemo(() => {
    const withOrder = rows.filter(r => r.item.plannedOrderDate).length;
    const withDelivery = rows.filter(r => r.item.plannedDeliveryDate).length;
    return {
      withOrder, withoutOrder: rows.length - withOrder,
      withDelivery, withoutDelivery: rows.length - withDelivery,
    };
  }, [rows]);

  const submit = () => {
    // Co se aplikuje:
    // - setOrder=true & clearOrder=true → ''
    // - setOrder=true & clearOrder=false → orderDate (musí být vyplněn)
    // - setOrder=false → null (nezměnit)
    let plannedOrderDate = null;
    let plannedDeliveryDate = null;
    if (setOrder) {
      if (clearOrder) plannedOrderDate = '';
      else if (orderDate) plannedOrderDate = orderDate;
      else { alert('Vyplňte plánované datum objednání nebo zaškrtněte „Vymazat".'); return; }
    }
    if (setDelivery) {
      if (clearDelivery) plannedDeliveryDate = '';
      else if (deliveryDate) plannedDeliveryDate = deliveryDate;
      else { alert('Vyplňte plánované datum dodání nebo zaškrtněte „Vymazat".'); return; }
    }
    if (plannedOrderDate === null && plannedDeliveryDate === null) {
      alert('Vyberte alespoň jedno pole k nastavení.');
      return;
    }
    // Validace: datum dodání by mělo být >= datum objednání
    if (typeof plannedOrderDate === 'string' && plannedOrderDate &&
        typeof plannedDeliveryDate === 'string' && plannedDeliveryDate &&
        plannedDeliveryDate < plannedOrderDate) {
      if (!window.confirm('Plánované datum dodání je dříve než datum objednání. Pokračovat?')) return;
    }
    onConfirm(plannedOrderDate, plannedDeliveryDate);
  };

  // Pomocný shortcut: nastavit dodání = objednání + N dní
  const addDaysToOrder = (days) => {
    if (!orderDate) { alert('Nejprve nastavte plánované datum objednání.'); return; }
    const d = new Date(orderDate + 'T00:00:00Z');
    d.setUTCDate(d.getUTCDate() + days);
    setDeliveryDate(d.toISOString().slice(0, 10));
    setClearDelivery(false);
  };

  return (
    <Modal title={`Nastavit plánované datumy pro ${rows.length} ${rows.length === 1 ? 'položku' : rows.length < 5 ? 'položky' : 'položek'}`} onClose={onClose} maxWidth={560}>
      <div style={{ marginBottom: 14, padding: 10, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, fontSize: 12, color: '#166534' }}>
        Vybráno <strong>{rows.length}</strong> {rows.length === 1 ? 'položka' : 'položek'}.
        Aktuálně:
        <ul style={{ margin: '6px 0 0', paddingLeft: 20 }}>
          <li>📅 Plán. objednání: <strong>{stats.withOrder}</strong> nastaveno · <strong>{stats.withoutOrder}</strong> bez data</li>
          <li>📦 Plán. dodání: <strong>{stats.withDelivery}</strong> nastaveno · <strong>{stats.withoutDelivery}</strong> bez data</li>
        </ul>
      </div>

      {/* Plánované objednání */}
      <div style={{ padding: 10, border: '1px solid #e2e8f0', borderRadius: 6, marginBottom: 10 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer' }}>
          <input type="checkbox" checked={setOrder} onChange={e => setSetOrder(e.target.checked)} />
          <span style={{ fontWeight: 700, fontSize: 13 }}>📅 Plánované datum objednání</span>
        </label>
        {setOrder && (
          <div style={{ paddingLeft: 24 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="date"
                style={{ ...styles.input, flex: 1 }}
                value={orderDate}
                onChange={e => { setOrderDate(e.target.value); setClearOrder(false); }}
                disabled={clearOrder}
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, cursor: 'pointer' }}>
                <input type="checkbox" checked={clearOrder} onChange={e => { setClearOrder(e.target.checked); if (e.target.checked) setOrderDate(''); }} />
                Vymazat
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Plánované dodání */}
      <div style={{ padding: 10, border: '1px solid #e2e8f0', borderRadius: 6, marginBottom: 10 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer' }}>
          <input type="checkbox" checked={setDelivery} onChange={e => setSetDelivery(e.target.checked)} />
          <span style={{ fontWeight: 700, fontSize: 13 }}>📦 Plánované datum dodání</span>
        </label>
        {setDelivery && (
          <>
            <div style={{ paddingLeft: 24 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  type="date"
                  style={{ ...styles.input, flex: 1 }}
                  value={deliveryDate}
                  onChange={e => { setDeliveryDate(e.target.value); setClearDelivery(false); }}
                  disabled={clearDelivery}
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, cursor: 'pointer' }}>
                  <input type="checkbox" checked={clearDelivery} onChange={e => { setClearDelivery(e.target.checked); if (e.target.checked) setDeliveryDate(''); }} />
                  Vymazat
                </label>
              </div>
              {orderDate && !clearDelivery && (
                <div style={{ display: 'flex', gap: 4, marginTop: 6, fontSize: 11, color: '#64748b', flexWrap: 'wrap' }}>
                  <span style={{ alignSelf: 'center' }}>Rychle: objednání +</span>
                  {[3, 7, 14, 21, 30].map(d => (
                    <button key={d} type="button" onClick={() => addDaysToOrder(d)}
                      style={{ padding: '2px 8px', fontSize: 11, background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 4, cursor: 'pointer' }}>
                      {d} dní
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div style={{ maxHeight: 180, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: 6, marginTop: 10 }}>
        <table style={{ ...styles.table, fontSize: 11 }}>
          <thead>
            <tr>
              <th style={styles.th}>Položka</th>
              <th style={styles.th}>Projekt</th>
              <th style={styles.th}>Plán. obj.</th>
              <th style={styles.th}>Plán. dod.</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.key} style={styles.tr}>
                <td style={styles.td}>{r.item.name}</td>
                <td style={{ ...styles.td, fontSize: 10, color: '#64748b' }}>
                  {r.projectName}
                  {r.projectClient && <div style={{ fontSize: 9, color: '#94a3b8' }}>{r.projectClient}</div>}
                </td>
                <td style={{ ...styles.td, fontSize: 10, color: r.item.plannedOrderDate ? '#475569' : '#cbd5e1' }}>
                  {r.item.plannedOrderDate || '—'}
                </td>
                <td style={{ ...styles.td, fontSize: 10, color: r.item.plannedDeliveryDate ? '#475569' : '#cbd5e1' }}>
                  {r.item.plannedDeliveryDate || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.modalActions}>
        <button style={styles.secondaryBtn} onClick={onClose}>Zrušit</button>
        <button style={styles.primaryBtn} onClick={submit}>
          <Calendar size={14} /> Aplikovat datumy
        </button>
      </div>
    </Modal>
  );
}

// ==========================================================================
// Quick Price edit modal (for items in Purchase List — edit qty, unit, price)
// ==========================================================================

function QuickPriceModal({ row, fxRate, onSave, onClose }) {
  const [quantity, setQuantity] = useState(row.item.quantity);
  const [unit, setUnit] = useState(row.item.unit || 'pcs');
  const [unitPrice, setUnitPrice] = useState(row.item.unitPrice);
  const [currency, setCurrency] = useState(row.item.currency || 'CZK');

  const line = (parseFloat(quantity) || 0) * (parseFloat(unitPrice) || 0);
  const lineCZK = currency === 'EUR' ? line * fxRate : line;

  const submit = () => {
    const patch = {
      quantity: parseFloat(quantity) || 0,
      unit,
      unitPrice: parseFloat(unitPrice) || 0,
      currency,
    };
    // Break catalog link on manual price edit (consistent with ItemModal behaviour)
    if (row.item.catalogId && parseFloat(unitPrice) !== parseFloat(row.item.unitPrice)) {
      patch.catalogId = '';
    }
    onSave(patch);
  };

  return (
    <Modal title="Upravit množství a cenu" onClose={onClose} maxWidth={520}>
      <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 12px' }}>
        <strong>{row.item.name}</strong> · {row.projectName}
      </p>
      {!row.hasSupplier && (
        <div style={{ padding: 10, background: '#fef3c7', color: '#92400e', borderRadius: 6, fontSize: 12, marginBottom: 12 }}>
          ⓘ Zatím není přiřazen žádný dodavatel. Cenu zde můžete upřesnit; pozdější přiřazení dodavatele toto nepřepíše.
        </div>
      )}
      <div style={styles.formRowGroup}>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Množství *</label>
          <input type="number" step="0.01" style={styles.input} value={quantity}
            onChange={e => setQuantity(e.target.value)} autoFocus />
        </div>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Jednotka</label>
          <select style={styles.input} value={unit} onChange={e => setUnit(e.target.value)}>
            <option value="pcs">pcs</option><option value="m">m</option><option value="m²">m²</option>
            <option value="kg">kg</option><option value="set">set</option><option value="pack">pack</option>
            <option value="hr">hr</option><option value="day">day</option>
            <option value="%">%</option><option value="lump">lump</option>
          </select>
        </div>
      </div>
      <div style={styles.formRowGroup}>
        <div style={{ flex: 2 }}>
          <label style={styles.label}>Jednotková cena *</label>
          <input type="number" step="0.01" style={styles.input} value={unitPrice}
            onChange={e => setUnitPrice(e.target.value)} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Měna</label>
          <select style={styles.input} value={currency} onChange={e => setCurrency(e.target.value)}>
            <option value="CZK">CZK</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
      </div>
      <div style={styles.totalPreview}>
        Line total: <strong>{fmt2(line, currency)}</strong>
        {currency === 'EUR' && <> → <strong>{fmt(lineCZK)}</strong></>}
      </div>
      <div style={styles.modalActions}>
        <button style={styles.secondaryBtn} onClick={onClose}>Zrušit</button>
        <button style={styles.primaryBtn} onClick={submit}>Uložit</button>
      </div>
    </Modal>
  );
}

// ==========================================================================
// Order Batch Modal — groups by supplier, one order per supplier
// ==========================================================================

function OrderBatchModal({ rows, suppliers, onConfirm, onClose }) {
  // Group rows by supplier
  const groups = useMemo(() => {
    const map = new Map();
    rows.forEach(r => {
      const key = r.supplier?.id || `free_${r.supplierName}`;
      if (!map.has(key)) map.set(key, { key, supplier: r.supplier, label: r.supplierName, rows: [], total: 0 });
      const g = map.get(key);
      g.rows.push(r); g.total += r.czk;
    });
    return Array.from(map.values());
  }, [rows]);

  // Per-supplier form: orderNumber, orderDate, plannedDeliveryDate
  const [forms, setForms] = useState(() => {
    const init = {};
    groups.forEach(g => {
      // Pick max plannedOrderDate among rows as default orderDate, else today
      const dates = g.rows.map(r => r.item.plannedOrderDate).filter(Boolean);
      const deliveries = g.rows.map(r => r.item.plannedDeliveryDate).filter(Boolean);
      init[g.key] = {
        orderNumber: '',
        orderDate: todayISO(),
        plannedDeliveryDate: deliveries.length > 0 ? deliveries.sort().pop() : '',
      };
    });
    return init;
  });

  const updateForm = (key, patch) => setForms(f => ({ ...f, [key]: { ...f[key], ...patch } }));

  const allValid = groups.every(g => forms[g.key]?.orderDate);

  const submit = () => {
    const updates = [];
    groups.forEach(g => {
      const f = forms[g.key];
      g.rows.forEach(r => {
        updates.push({
          projectId: r.projectId, itemId: r.item.id,
          patch: {
            status: 'ordered',
            purchaseDate: f.orderDate,               // actual order date
            orderNumber: f.orderNumber.trim() || '',
            // plannedDeliveryDate stays; can be updated here
            plannedDeliveryDate: f.plannedDeliveryDate || r.item.plannedDeliveryDate || '',
          },
        });
      });
    });
    onConfirm(updates);
  };

  const grandTotal = rows.reduce((s, r) => s + r.czk, 0);

  return (
    <Modal title="Vytvořit objednávku(y)" onClose={onClose} maxWidth={720}>
      <p style={{ color: '#64748b', fontSize: 14, margin: '0 0 14px' }}>
        {rows.length} {rows.length === 1 ? 'položka' : (rows.length >= 2 && rows.length <= 4 ? 'položky' : 'položek')} · {fmt(grandTotal)} · seskupeno do <strong>{groups.length} {groups.length === 1 ? 'objednávky' : 'objednávek'}</strong> podle dodavatele. Pro každou vyplňte číslo objednávky a plánované datum dodání.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxHeight: '60vh', overflowY: 'auto' }}>
        {groups.map(g => {
          const f = forms[g.key] || {};
          return (
            <div key={g.key} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{g.label}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{g.rows.length} {g.rows.length === 1 ? 'položka' : (g.rows.length >= 2 && g.rows.length <= 4 ? 'položky' : 'položek')} · {fmt(g.total)}</div>
                </div>
              </div>

              <div style={styles.formRowGroup}>
                <div style={{ flex: 1.5 }}>
                  <label style={styles.label}>Číslo objednávky</label>
                  <input style={styles.input} value={f.orderNumber || ''}
                    onChange={e => updateForm(g.key, { orderNumber: e.target.value })}
                    placeholder="e.g. PO-2026-0042" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Datum objednávky *</label>
                  <input type="date" style={styles.input} value={f.orderDate || ''}
                    onChange={e => updateForm(g.key, { orderDate: e.target.value })} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Plán. dodání</label>
                  <input type="date" style={styles.input} value={f.plannedDeliveryDate || ''}
                    onChange={e => updateForm(g.key, { plannedDeliveryDate: e.target.value })} />
                </div>
              </div>

              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                {g.rows.slice(0, 3).map(r => r.item.name).join(' · ')}
                {g.rows.length > 3 && ` · +${g.rows.length - 3} more`}
              </div>
            </div>
          );
        })}
      </div>

      <div style={styles.modalActions}>
        <button style={styles.secondaryBtn} onClick={onClose}>Zrušit</button>
        <button style={styles.primaryBtn} onClick={submit} disabled={!allValid}>
          <ShoppingCart size={15} /> Vytvořit {groups.length} {groups.length === 1 ? 'objednávku' : (groups.length >= 2 && groups.length <= 4 ? 'objednávky' : 'objednávek')} →
        </button>
      </div>
    </Modal>
  );
}

// ==========================================================================
// Orders View — items that have been ordered
// ==========================================================================

function OrdersView({ projects, categories, suppliers, fxRate, focusKey, readOnly, onUpdateItem, onBatchUpdate, onStockReceive, onImportOrder, onImportPDF, onAttachInvoicePDF, stockItems = [], onGoToStock }) {
  const [selected, setSelected] = useState(() => new Set());
  const [batchModal, setBatchModal] = useState(null);
  const [query, setQuery] = useState('');
  const [filterSupplier, setFilterSupplier] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterInvoiced, setFilterInvoiced] = useState('all'); // all | yes | no
  const [showCompleted, setShowCompleted] = useState(false); // ve výchozím stavu skrýt dokončené objednávky
  const [filterProject, setFilterProject] = useState('all');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Orders = items that are ordered/delivered/invoiced
  const orderItems = useMemo(() => {
    const out = [];
    projects.forEach(p => {
      p.items.forEach(i => {
        const status = i.status || 'planned';
        if (status === 'planned') return;
        const cat = categories.find(c => c.id === i.category);
        const sup = suppliers.find(s => s.id === i.supplierId);
        out.push({
          key: `${p.id}:${i.id}`, projectId: p.id, projectName: p.name, projectClient: p.client || '',
          item: i, category: cat, supplier: sup,
          supplierName: sup?.name || i.supplier || '(bez dodavatele)',
          czk: toCZK(i, fxRate),
          status,
          orderKey: i.orderNumber
            ? `${i.orderNumber}__${i.supplierId || i.supplier || 'x'}`
            : `(bez čísla objednávky)__${i.supplierId || i.supplier || 'x'}__${i.purchaseDate || ''}__${i.id}`,
        });
      });
    });
    return out;
  }, [projects, categories, suppliers, fxRate]);

  const filteredItems = useMemo(() => {
    return orderItems.filter(r => {
      if (filterSupplier !== 'all' && r.supplier?.id !== filterSupplier) return false;
      // Stav dodání — physical progress
      if (filterStatus === 'ordered' && r.status !== 'ordered') return false;
      if (filterStatus === 'delivered' && r.status !== 'delivered') return false;
      // Stav fakturace — samostatná dimenze
      if (filterInvoiced === 'yes' && !r.item.isInvoiced) return false;
      if (filterInvoiced === 'no' && r.item.isInvoiced) return false;
      if (filterProject !== 'all' && r.projectId !== filterProject) return false;
      if (query.trim()) {
        if (!searchMatch(query, [
          r.item.name, r.item.notes, r.item.orderNumber,
          r.supplierName, r.projectName, r.projectClient, r.category?.name,
          r.item.purchaseDate, r.item.deliveredDate, r.item.invoicedDate,
        ])) return false;
      }
      return true;
    });
  }, [orderItems, query, filterSupplier, filterStatus, filterInvoiced, filterProject]);

  const activeFilters = (filterSupplier !== 'all' ? 1 : 0) + (filterStatus !== 'all' ? 1 : 0) + (filterInvoiced !== 'all' ? 1 : 0) + (filterProject !== 'all' ? 1 : 0);

  // Focus/scroll/highlight když přijdeme z dashboardu
  const rowRefs = useRef({});
  const focusedKey = focusKey ? `${focusKey.projectId}:${focusKey.itemId}` : null;
  useEffect(() => {
    if (!focusKey) return;
    // Skok z projektu s filtrem — nastavíme filter na daný projekt
    if (focusKey.filterProjectId) {
      setFilterProject(focusKey.filterProjectId);
      setQuery('');
      setFilterSupplier('all');
      setFilterStatus('all');
      setFilterInvoiced('all');
      setShowCompleted(false); // ukázat aktivní záložku
      setFiltersOpen(true);
      return;
    }
    // Když focus obsahuje orderNumber (např. při skoku ze skladu),
    // automaticky nastavíme filter na dané číslo objednávky.
    if (focusKey.orderNumber) {
      setQuery(focusKey.orderNumber);
      // Vyresetovat ostatní filtry, aby objednávka byla určitě viditelná
      setFilterSupplier('all');
      setFilterStatus('all');
      setFilterInvoiced('all');
      setFilterProject('all');
    }
    const key = `${focusKey.projectId}:${focusKey.itemId}`;
    const t = setTimeout(() => {
      const el = rowRefs.current[key];
      if (el && el.scrollIntoView) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
    return () => clearTimeout(t);
  }, [focusKey?.ts]);

  // Group by Order (supplier + order number + order date)
  const orders = useMemo(() => {
    const map = new Map();
    filteredItems.forEach(r => {
      if (!map.has(r.orderKey)) {
        map.set(r.orderKey, {
          key: r.orderKey, orderNumber: r.item.orderNumber || '',
          supplierName: r.supplierName, supplierId: r.item.supplierId,
          orderDate: r.item.purchaseDate || '', rows: [], total: 0,
        });
      }
      const o = map.get(r.orderKey);
      o.rows.push(r); o.total += r.czk;
    });

    // Označit dokončené objednávky:
    // ✓ všechny položky status='delivered'
    // ✓ všechny položky isInvoiced=true
    // ✓ všechny materiálové položky plně naskladněné (nemateriálové se ignorují — nemají sklad)
    const out = Array.from(map.values()).map(o => {
      const allDelivered = o.rows.every(r => r.item.status === 'delivered');
      const allInvoiced = o.rows.every(r => r.item.isInvoiced);
      const allStocked = o.rows.every(r => {
        const isMaterial = r.category?.kind === 'material';
        if (!isMaterial) return true; // nemateriál se neposkládá
        const stockedCount = stockItems
          .filter(s => s.sourceOrderItemId === r.item.id)
          .reduce((sum, s) => sum + (parseInt(s.batchQuantity, 10) || 1), 0);
        return stockedCount >= (parseFloat(r.item.quantity) || 0);
      });
      return { ...o, isCompleted: allDelivered && allInvoiced && allStocked };
    });

    out.sort((a, b) => (b.orderDate || '').localeCompare(a.orderDate || ''));
    return out;
  }, [filteredItems, stockItems]);

  // Rozdělit na aktivní a dokončené
  const activeOrders = useMemo(() => orders.filter(o => !o.isCompleted), [orders]);
  const completedOrders = useMemo(() => orders.filter(o => o.isCompleted), [orders]);
  const visibleOrders = showCompleted ? completedOrders : activeOrders;

  // Když přijdeme z jiné sekce s focusKey.orderNumber a objednávka je jen v archivu,
  // automaticky přepneme na záložku Archiv (jinak by uživatel viděl prázdný seznam).
  useEffect(() => {
    if (!focusKey?.orderNumber) return;
    const num = focusKey.orderNumber;
    const isInActive = activeOrders.some(o => o.orderNumber === num);
    const isInCompleted = completedOrders.some(o => o.orderNumber === num);
    if (!isInActive && isInCompleted) {
      setShowCompleted(true);
    } else if (isInActive) {
      setShowCompleted(false);
    }
  }, [focusKey?.ts, activeOrders, completedOrders]);

  // Wrapper kolem onUpdateItem — před uložením zkontroluje, jestli by změna neoznačila
  // objednávku jako dokončenou přesto, že některé MATERIÁLOVÉ položky ještě nejsou plně
  // naskladněné. Pokud ano, zeptá se uživatele na potvrzení.
  // (Nemateriálové položky jako obchodní provize se neposkládají, ty aplikace ignoruje.)
  const wrappedUpdateItem = (projectId, itemId, patch) => {
    // Najít objednávku, do které tato položka spadá
    const order = orders.find(o => o.rows.some(r => r.projectId === projectId && r.item.id === itemId));
    if (!order || order.isCompleted) {
      // Není v objednávce, nebo už je hotová — jen aplikuj
      onUpdateItem(projectId, itemId, patch);
      return;
    }

    // Simulovat, jak by objednávka vypadala po změně
    const simulatedRows = order.rows.map(r => {
      if (r.projectId === projectId && r.item.id === itemId) {
        return { ...r, item: { ...r.item, ...patch } };
      }
      return r;
    });
    const wouldBeAllDelivered = simulatedRows.every(r => r.item.status === 'delivered');
    const wouldBeAllInvoiced = simulatedRows.every(r => r.item.isInvoiced);
    const wouldBeCompleted = wouldBeAllDelivered && wouldBeAllInvoiced;

    if (!wouldBeCompleted) {
      onUpdateItem(projectId, itemId, patch);
      return;
    }

    // Prověřit, jestli jsou nedodělaná naskladnění
    const unstockedMaterials = simulatedRows.filter(r => {
      const isMaterial = r.category?.kind === 'material';
      if (!isMaterial) return false;
      const stockedCount = stockItems
        .filter(s => s.sourceOrderItemId === r.item.id)
        .reduce((sum, s) => sum + (parseInt(s.batchQuantity, 10) || 1), 0);
      return stockedCount < (parseFloat(r.item.quantity) || 0);
    });

    if (unstockedMaterials.length === 0) {
      // Všechen materiál je naskladněn — v pořádku, jen aplikuj (objednávka se skryje jako dokončená)
      onUpdateItem(projectId, itemId, patch);
      return;
    }

    // Něco není naskladněno — zeptat se
    const names = unstockedMaterials.slice(0, 5).map(r => `• ${r.item.name}`).join('\n');
    const more = unstockedMaterials.length > 5 ? `\n… a další ${unstockedMaterials.length - 5}` : '';
    const msg = `Objednávka bude po této změně označena jako DOKONČENÁ a skryta ze seznamu.\n\nTěchto ${unstockedMaterials.length} materiálových položek ale ještě není naskladněno:\n\n${names}${more}\n\nOpravdu chcete pokračovat?`;
    if (window.confirm(msg)) {
      onUpdateItem(projectId, itemId, patch);
    }
    // else: neaplikovat — checkbox se nezmění, dropdown zůstane jak byl (React vrátí controlled state)
  };

  const toggleRow = (key) => {
    const next = new Set(selected);
    if (next.has(key)) next.delete(key); else next.add(key);
    setSelected(next);
  };
  const toggleGroup = (groupRows) => {
    const next = new Set(selected);
    const keys = groupRows.map(r => r.key);
    const allSelected = keys.every(k => next.has(k));
    if (allSelected) keys.forEach(k => next.delete(k));
    else keys.forEach(k => next.add(k));
    setSelected(next);
  };

  const selectedRows = orderItems.filter(r => selected.has(r.key));
  const selectedTotal = selectedRows.reduce((s, r) => s + r.czk, 0);

  if (projects.length === 0) return <EmptyState onCreate={() => {}} />;

  return (
    <main style={styles.main}>
      <div style={styles.mainHeader}>
        <div>
          <h2 style={styles.projectTitle}>Objednávky</h2>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>
            {showCompleted
              ? `${completedOrders.length} ${completedOrders.length === 1 ? 'dokončená objednávka' : (completedOrders.length >= 2 && completedOrders.length <= 4 ? 'dokončené objednávky' : 'dokončených objednávek')} v archivu.`
              : `${activeOrders.length} ${activeOrders.length === 1 ? 'aktivní objednávka' : (activeOrders.length >= 2 && activeOrders.length <= 4 ? 'aktivní objednávky' : 'aktivních objednávek')} · ${orderItems.length} ${orderItems.length === 1 ? 'položka' : (orderItems.length >= 2 && orderItems.length <= 4 ? 'položky' : 'položek')}. Označte jako dodané / vyfakturované, jakmile budou známy skutečné údaje.`}
          </p>
        </div>
        {!readOnly && (
          <div style={styles.headerActions}>
            <button style={styles.secondaryBtn} onClick={onImportPDF} title="Import faktury / objednávky z PDF pomocí AI">
              <FileText size={14} /> Import z PDF (AI)
            </button>
            <button style={styles.primaryBtn} onClick={onImportOrder}>
              <Upload size={14} /> Importovat objednávku
            </button>
          </div>
        )}
      </div>

      {/* Záložky Aktivní / Archiv */}
      <div style={{
        display: 'flex', gap: 0, marginTop: 16, marginBottom: 16,
        borderBottom: '1px solid #e2e8f0',
      }}>
        <button
          onClick={() => setShowCompleted(false)}
          style={{
            padding: '10px 18px', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: !showCompleted ? '#0d3825' : '#94a3b8',
            borderBottom: !showCompleted ? '2px solid #0d3825' : '2px solid transparent',
            marginBottom: -1, display: 'inline-flex', alignItems: 'center', gap: 6,
          }}
        >
          <CircleDot size={13} /> Aktivní
          <span style={{
            padding: '1px 7px', borderRadius: 999, fontSize: 11, fontWeight: 700,
            background: !showCompleted ? '#0d3825' : '#e2e8f0',
            color: !showCompleted ? '#fff' : '#64748b',
          }}>{activeOrders.length}</span>
        </button>
        <button
          onClick={() => setShowCompleted(true)}
          style={{
            padding: '10px 18px', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: showCompleted ? '#0d3825' : '#94a3b8',
            borderBottom: showCompleted ? '2px solid #0d3825' : '2px solid transparent',
            marginBottom: -1, display: 'inline-flex', alignItems: 'center', gap: 6,
          }}
        >
          <CheckCircle2 size={13} /> Archiv
          <span style={{
            padding: '1px 7px', borderRadius: 999, fontSize: 11, fontWeight: 700,
            background: showCompleted ? '#166534' : '#e2e8f0',
            color: showCompleted ? '#fff' : '#64748b',
          }}>{completedOrders.length}</span>
        </button>
      </div>

      <div style={styles.searchBar}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <SearchInput value={query} onChange={setQuery} placeholder="Hledat objednávku, dodavatele, položku..." />
        </div>
        <button
          style={filtersOpen || activeFilters > 0 ? { ...styles.sortBtnActive, padding: '7px 12px' } : { ...styles.sortBtn, padding: '7px 12px' }}
          onClick={() => setFiltersOpen(v => !v)}
        >
          <Filter size={13} /> Filtry {activeFilters > 0 && <span style={{ padding: '0 6px', background: '#fff', color: '#0d3825', borderRadius: 999, fontSize: 10, fontWeight: 700, marginLeft: 4 }}>{activeFilters}</span>}
        </button>
        {(query || activeFilters > 0) && (
          <button
            style={{ ...styles.sortBtn, padding: '7px 12px' }}
            onClick={() => { setQuery(''); setFilterSupplier('all'); setFilterStatus('all'); setFilterInvoiced('all'); setFilterProject('all'); }}
          >Vymazat vše</button>
        )}
        <div style={{ fontSize: 12, color: '#64748b', marginLeft: 'auto' }}>
          {filteredItems.length} / {orderItems.length} položek
        </div>
      </div>

      {filtersOpen && (
        <div style={styles.filterPanel}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            <div>
              <label style={styles.label}>Dodavatel</label>
              <select style={styles.input} value={filterSupplier} onChange={e => setFilterSupplier(e.target.value)}>
                <option value="all">Všichni</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label style={styles.label}>Stav dodání</label>
              <select style={styles.input} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="all">Všechny</option>
                <option value="ordered">Objednáno (nedodáno)</option>
                <option value="delivered">Dodáno</option>
              </select>
            </div>
            <div>
              <label style={styles.label}>Stav fakturace</label>
              <select style={styles.input} value={filterInvoiced} onChange={e => setFilterInvoiced(e.target.value)}>
                <option value="all">Všechny</option>
                <option value="yes">✓ Vyfakturováno</option>
                <option value="no">Nevyfakturováno</option>
              </select>
            </div>
            <div>
              <label style={styles.label}>Projekt</label>
              <select style={styles.input} value={filterProject} onChange={e => setFilterProject(e.target.value)}>
                <option value="all">Všechny</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {!readOnly && selected.size > 0 && (
        <div style={styles.actionBar}>
          <div><strong>{selected.size}</strong> vybráno · <strong>{fmt(selectedTotal)}</strong></div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button style={styles.sortBtn} onClick={() => setSelected(new Set())}>Vymazat</button>
            <button style={styles.secondaryBtnDark} onClick={() => setBatchModal({ action: 'delivered', rows: selectedRows })}><Truck size={14} /> Dodáno</button>
            <button style={styles.primaryBtn} onClick={() => setBatchModal({ action: 'invoiced', rows: selectedRows })}><FileText size={14} /> Vyfakturováno</button>
          </div>
        </div>
      )}

      {visibleOrders.length === 0 ? (
        <div style={styles.emptyItems}>
          <ListChecks size={32} style={{ color: '#cbd5e1' }} />
          <p style={{ color: '#64748b', margin: '12px 0 0' }}>
            {showCompleted
              ? 'V archivu nejsou žádné dokončené objednávky.'
              : (orders.length === 0
                ? 'Žádné aktivní objednávky. Vytvořte novou z Nákupního seznamu.'
                : 'Všechny objednávky jsou dokončené — přepněte se do záložky Archiv nahoře.')}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {visibleOrders.map(o => {
            const keys = o.rows.map(r => r.key);
            const allSel = keys.every(k => selected.has(k));
            const someSel = !allSel && keys.some(k => selected.has(k));

            // Compute order-level status: min status across rows
            const statuses = new Set(o.rows.map(r => r.status));
            let orderStatus = 'ordered';
            if (statuses.size === 1) orderStatus = [...statuses][0];
            else if (statuses.has('ordered')) orderStatus = 'ordered';
            else if (statuses.has('delivered')) orderStatus = 'delivered';

            // Vyfakturováno na úrovni objednávky = všechny řádky vyfakturované
            const allInvoiced = o.rows.every(r => r.item.isInvoiced);
            const someInvoiced = o.rows.some(r => r.item.isInvoiced);

            // Planned delivery: most common / first among rows
            const plannedDeliveries = [...new Set(o.rows.map(r => r.item.plannedDeliveryDate).filter(Boolean))];

            const pdfAttachmentId = o.rows.find(r => r.item.pdfAttachmentId)?.item.pdfAttachmentId;
            return (
              <div key={o.key} style={{
                ...styles.orderCard,
                ...(o.isCompleted ? { opacity: 0.7, borderColor: '#86efac' } : {}),
              }}>
                <div style={styles.orderCardHeader}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flex: 1, minWidth: 0 }}>
                    <input type="checkbox" checked={allSel} ref={el => { if (el) el.indeterminate = someSel; }} onChange={() => toggleGroup(o.rows)} />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 15, fontWeight: 700 }}>{o.supplierName}</span>
                        {o.orderNumber && <span style={styles.orderNumberBadge}>#{o.orderNumber}</span>}
                        <StatusPill status={orderStatus} />
                        {o.isCompleted && (
                          <span style={{
                            padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700,
                            background: '#166534', color: '#fff',
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                          }}>
                            <CheckCircle2 size={11} /> Dokončeno
                          </span>
                        )}
                        {!readOnly && !o.isCompleted && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onAttachInvoicePDF && onAttachInvoicePDF(o);
                            }}
                            style={{
                              padding: '4px 10px', fontSize: 11, fontWeight: 600,
                              background: '#8b5cf6', color: '#fff', border: 'none',
                              borderRadius: 4, cursor: 'pointer', fontFamily: 'inherit',
                              display: 'inline-flex', alignItems: 'center', gap: 4,
                            }}
                            title="Přehrát objednávku daty z faktury (PDF/AI)"
                          >
                            <FileText size={11} /> Přehrát z faktury
                          </button>
                        )}
                        {pdfAttachmentId && (
                          <button
                            onClick={async (e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              try {
                                const record = await getPdfFromDb(pdfAttachmentId);
                                if (!record) { alert('PDF již není v databázi.'); return; }
                                const bytes = Uint8Array.from(atob(record.base64), c => c.charCodeAt(0));
                                const blob = new Blob([bytes], { type: 'application/pdf' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.target = '_blank';
                                a.rel = 'noopener noreferrer';
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                setTimeout(() => URL.revokeObjectURL(url), 60000);
                              } catch (err) {
                                alert('PDF nelze otevřít: ' + err.message);
                              }
                            }}
                            style={{
                              padding: '4px 10px', fontSize: 11, fontWeight: 600,
                              background: '#0d3825', color: '#fff', border: 'none',
                              borderRadius: 4, cursor: 'pointer', fontFamily: 'inherit',
                              display: 'inline-flex', alignItems: 'center', gap: 4,
                            }}
                            title="Otevřít archivované PDF v novém tabu"
                          >
                            📎 PDF
                          </button>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b', marginTop: 3, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <span><ShoppingCart size={10} style={{ verticalAlign: 'middle' }} /> Objednáno {o.orderDate || '—'}</span>
                        {plannedDeliveries.length > 0 && (
                          <span><Truck size={10} style={{ verticalAlign: 'middle' }} /> Plán. dodání {plannedDeliveries.join(', ')}</span>
                        )}
                        <span>{o.rows.length} {o.rows.length === 1 ? 'položka' : (o.rows.length >= 2 && o.rows.length <= 4 ? 'položky' : 'položek')}</span>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>{fmt(o.total)}</span>
                      </div>
                    </div>
                  </label>
                </div>
                <div style={styles.tableWrap}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={{ ...styles.th, width: 36 }}></th>
                        <th style={styles.th}>Stav</th>
                        <th style={styles.th}>Projekt</th>
                        <th style={styles.th}>Položka</th>
                        <th style={{ ...styles.th, textAlign: 'right' }}>Celkem</th>
                        <th style={styles.th}>Dodáno</th>
                        <th style={styles.th}>Vyfakturováno</th>
                        {!readOnly && <th style={{ ...styles.th, width: 110 }}>Sklad</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {o.rows.map(r => {
                        const isSel = selected.has(r.key);
                        const isFocused = focusedKey === r.key;
                        return (
                          <tr
                            key={r.key}
                            ref={el => { if (el) rowRefs.current[r.key] = el; }}
                            style={{
                              ...styles.tr,
                              background: isFocused ? '#fde68a' : (isSel ? '#fef3c7' : 'transparent'),
                              boxShadow: isFocused ? 'inset 3px 0 0 #f59e0b' : 'none',
                              transition: 'background 0.3s',
                            }}
                          >
                            <td style={styles.td}><input type="checkbox" checked={isSel} onChange={() => toggleRow(r.key)} disabled={readOnly} /></td>
                            <td style={styles.td}>
                              <StatusPill
                                status={r.item.status || 'ordered'}
                                isInvoiced={r.item.isInvoiced}
                                readOnly={readOnly}
                                onChange={(s) => !readOnly && wrappedUpdateItem(r.projectId, r.item.id, { status: s })}
                                onChangeInvoiced={(v) => !readOnly && wrappedUpdateItem(r.projectId, r.item.id, { isInvoiced: v })}
                              />
                            </td>
                            <td style={{ ...styles.td, fontSize: 12, color: '#475569' }}>
                              <div>{r.projectName}</div>
                              {r.projectClient && (
                                <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>{r.projectClient}</div>
                              )}
                            </td>
                            <td style={styles.td}>
                              <div style={{ fontWeight: 500 }}>{r.item.name}</div>
                              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: r.category?.color || '#94a3b8' }} />
                                  {r.category?.name}
                                </span>
                                {' · '}{r.item.quantity} {r.item.unit}
                              </div>
                            </td>
                            <td style={{ ...styles.td, textAlign: 'right', fontWeight: 600 }}>{fmt(r.czk)}</td>
                            <td style={styles.td}>
                              {readOnly ? (
                                <span style={{ fontSize: 12 }}>{r.item.deliveredDate || '—'}</span>
                              ) : (
                                <input type="date" style={{ ...styles.input, padding: '3px 6px', fontSize: 11, width: 130 }}
                                  value={r.item.deliveredDate || ''}
                                  onChange={e => {
                                    const patch = { deliveredDate: e.target.value };
                                    if (e.target.value && (r.item.status === 'ordered')) patch.status = 'delivered';
                                    wrappedUpdateItem(r.projectId, r.item.id, patch);
                                  }} />
                              )}
                            </td>
                            <td style={styles.td}>
                              {readOnly ? (
                                <span style={{ fontSize: 12 }}>{r.item.invoicedDate || '—'}</span>
                              ) : (
                                <input type="date" style={{ ...styles.input, padding: '3px 6px', fontSize: 11, width: 130 }}
                                  value={r.item.invoicedDate || ''}
                                  onChange={e => {
                                    const patch = { invoicedDate: e.target.value };
                                    // Zadání data fakturace automaticky značí položku jako vyfakturovanou
                                    if (e.target.value) patch.isInvoiced = true;
                                    else patch.isInvoiced = false;
                                    wrappedUpdateItem(r.projectId, r.item.id, patch);
                                  }} />
                              )}
                            </td>
                            {!readOnly && (
                              <td style={styles.td}>
                                {(() => {
                                  // Najít kusy ve skladu, které byly naskladněny z této objednávkové položky
                                  const stockedItems = stockItems.filter(s => s.sourceOrderItemId === r.item.id);
                                  // Sumovat batchQuantity (batch může mít 22, jednotlivý 1)
                                  const stockedCount = stockedItems.reduce((sum, s) => sum + (parseInt(s.batchQuantity, 10) || 1), 0);
                                  const orderedQty = parseFloat(r.item.quantity) || 0;
                                  const isMaterial = r.category?.kind === 'material';
                                  const canReceive = ['ordered', 'delivered'].includes(r.item.status) && isMaterial;

                                  if (!canReceive) {
                                    return <span style={{ fontSize: 11, color: '#cbd5e1' }}>—</span>;
                                  }

                                  if (stockedCount === 0) {
                                    return (
                                      <button
                                        onClick={() => onStockReceive(r)}
                                        style={{
                                          display: 'inline-flex', alignItems: 'center', gap: 4,
                                          padding: '4px 10px', borderRadius: 6,
                                          background: '#10b981', color: '#fff',
                                          fontSize: 11, fontWeight: 600,
                                          border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                                        }}
                                        title="Naskladnit položku"
                                      >
                                        <Warehouse size={11} /> Naskladnit
                                      </button>
                                    );
                                  }

                                  // Položka už je (alespoň částečně) naskladněna
                                  const isFullyReceived = stockedCount >= orderedQty;
                                  const firstStockId = stockedItems[0]?.id;
                                  return (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                      <button
                                        onClick={() => onGoToStock && onGoToStock(firstStockId, r.item.id)}
                                        style={{
                                          display: 'inline-flex', alignItems: 'center', gap: 4,
                                          padding: '4px 10px', borderRadius: 6,
                                          background: isFullyReceived ? '#dbeafe' : '#fef3c7',
                                          color: isFullyReceived ? '#1e40af' : '#92400e',
                                          fontSize: 11, fontWeight: 600,
                                          border: `1px solid ${isFullyReceived ? '#93c5fd' : '#fcd34d'}`,
                                          cursor: 'pointer', fontFamily: 'inherit',
                                        }}
                                        title={isFullyReceived ? 'Zobrazit ve skladu' : 'Částečně naskladněno - zobrazit ve skladu'}
                                      >
                                        <CheckCircle2 size={11} />
                                        {isFullyReceived ? 'Naskladněno' : `Část (${stockedCount}/${orderedQty})`}
                                      </button>
                                      {!isFullyReceived && (
                                        <button
                                          onClick={() => onStockReceive(r)}
                                          style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 4,
                                            padding: '2px 8px', borderRadius: 4,
                                            background: 'transparent', color: '#10b981',
                                            fontSize: 10, fontWeight: 600,
                                            border: '1px solid #10b981', cursor: 'pointer', fontFamily: 'inherit',
                                          }}
                                          title="Naskladnit zbývající kusy"
                                        >
                                          + Doplnit
                                        </button>
                                      )}
                                    </div>
                                  );
                                })()}
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {batchModal && (
        <BatchActionModal action={batchModal.action} rows={batchModal.rows}
          onConfirm={(date) => {
            let updates;
            if (batchModal.action === 'invoiced') {
              // Vyfakturování je nezávislé — nemění status, jen nastaví isInvoiced + invoicedDate
              updates = batchModal.rows.map(r => ({
                projectId: r.projectId, itemId: r.item.id,
                patch: { isInvoiced: true, invoicedDate: date },
              }));
            } else {
              // Dodání → mění status + deliveredDate
              const dateField = 'deliveredDate';
              updates = batchModal.rows.map(r => ({
                projectId: r.projectId, itemId: r.item.id,
                patch: { status: 'delivered', [dateField]: date },
              }));
            }
            onBatchUpdate(updates);
            setSelected(new Set()); setBatchModal(null);
          }} onClose={() => setBatchModal(null)} />
      )}
    </main>
  );
}

function BatchActionModal({ action, rows, onConfirm, onClose }) {
  const [date, setDate] = useState(todayISO());
  const titles = {
    delivered: { title: 'Označit položky jako dodané', label: 'Skut. datum dodání', icon: <Truck size={16} /> },
    invoiced: { title: 'Označit položky jako vyfakturované', label: 'Datum fakturace', icon: <FileText size={16} /> },
  };
  const t = titles[action];
  const total = rows.reduce((s, r) => s + r.czk, 0);
  const byProject = rows.reduce((acc, r) => { acc[r.projectName] = (acc[r.projectName] || 0) + 1; return acc; }, {});

  return (
    <Modal title={t.title} onClose={onClose} maxWidth={520}>
      <p style={{ color: '#64748b', fontSize: 14, margin: '0 0 12px' }}>
        {rows.length} {rows.length === 1 ? 'položka' : (rows.length >= 2 && rows.length <= 4 ? 'položky' : 'položek')} napříč {Object.keys(byProject).length} {Object.keys(byProject).length === 1 ? 'projektem' : (Object.keys(byProject).length >= 2 && Object.keys(byProject).length <= 4 ? 'projekty' : 'projekty')}.
      </p>
      <div style={{ ...styles.totalPreview, borderLeftColor: '#6366f1', marginTop: 0, marginBottom: 14 }}>
        {Object.entries(byProject).map(([name, count]) => (
          <div key={name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span>{name}</span><span style={{ color: '#64748b' }}>{count}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, marginTop: 8, paddingTop: 8, borderTop: '1px solid #e2e8f0' }}>
          <span>Celkem</span><span>{fmt(total)}</span>
        </div>
      </div>
      <div style={styles.formRow}>
        <label style={styles.label}>{t.label} *</label>
        <input type="date" style={styles.input} value={date} onChange={e => setDate(e.target.value)} autoFocus />
      </div>
      <div style={styles.modalActions}>
        <button style={styles.secondaryBtn} onClick={onClose}>Zrušit</button>
        <button style={styles.primaryBtn} onClick={() => onConfirm(date)} disabled={!date}>{t.icon} Použít</button>
      </div>
    </Modal>
  );
}

// ==========================================================================
// Cash Flow View — now with Income & Outflow side-by-side
// ==========================================================================

function OverdueChip() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      fontSize: 9, padding: '1px 5px', borderRadius: 999,
      background: '#dc2626', color: '#fff',
      fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em',
      marginLeft: 4,
    }} title="Tento řádek obsahuje platby po splatnosti">
      <AlertTriangle size={9} /> po splatnosti
    </span>
  );
}

// ==========================================================================
// StockView — skladové hospodářství
// ==========================================================================

function StockView({ stockItems, stockMovements, locations, categories, projects, suppliers, fxRate, readOnly, focusKey, onAddStock, onEditStock, onTransferStock, onConsumeStock, onDeleteStock, onManageLocations, onBulkTransfer, onBulkConsume, onGoToOrders }) {
  const [tab, setTab] = useState('overview'); // overview | movements | warranty | byOrder
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('available'); // available | consumed | all
  const [query, setQuery] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  // Zobrazení: aggregated (default) — kusy se stejným názvem se sečtou; nebo detailed — každý kus na řádku
  const [viewMode, setViewMode] = useState('aggregated');
  // Které skupiny jsou rozbalené (v aggregated módu)
  const [expandedGroups, setExpandedGroups] = useState(() => new Set());
  // Selekce pro bulk operace
  const [selected, setSelected] = useState(() => new Set());
  const [bulkModal, setBulkModal] = useState(null); // { type: 'transfer'|'consume', items: [] }

  // Focus & scroll do konkrétního řádku, když přijdeme z OrdersView
  const rowRefs = useRef({});
  useEffect(() => {
    if (!focusKey) return;
    // Pokud máme stockItemId, najít řádek; jinak orderItemId hledat napříč stockItems
    let targetId = focusKey.stockItemId;
    if (!targetId && focusKey.orderItemId) {
      const match = stockItems.find(s => s.sourceOrderItemId === focusKey.orderItemId);
      targetId = match?.id;
    }
    if (!targetId) return;
    // Zaručit, že je položka vidět v aktuálním filtru: přepnout na "vše"
    setTab('overview');
    setFilterStatus('all');
    setFilterLocation('all');
    setFilterCategory('all');
    setQuery('');
    const t = setTimeout(() => {
      const el = rowRefs.current[targetId];
      if (el && el.scrollIntoView) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
    return () => clearTimeout(t);
  }, [focusKey?.ts]);
  const focusedId = focusKey?.stockItemId || (focusKey?.orderItemId
    ? stockItems.find(s => s.sourceOrderItemId === focusKey.orderItemId)?.id
    : null);

  // Filtrované položky
  const filteredItems = useMemo(() => {
    // Když filtr = "na cestě", schováme skutečné stock items — zobrazíme jen virtuální transit
    if (filterStatus === 'transit') return [];
    return stockItems.filter(s => {
      if (filterStatus === 'available' && s.status === 'consumed') return false;
      if (filterStatus === 'consumed' && s.status !== 'consumed') return false;
      if (filterLocation !== 'all' && s.locationId !== filterLocation) return false;
      if (filterCategory !== 'all' && s.category !== filterCategory) return false;
      if (query.trim()) {
        // Zjistit jméno projektu + klienta (přednost má consumed, pak zdrojový non-stock)
        let projId;
        if (s.consumedToProjectId) projId = s.consumedToProjectId;
        else if (s.sourceProjectId) {
          const src = projects.find(p => p.id === s.sourceProjectId);
          if (src && !src.isStockProject) projId = s.sourceProjectId;
        }
        const proj = projId ? projects.find(p => p.id === projId) : null;
        if (!searchMatch(query, [
          s.name, s.serialNumber, s.notes, s.supplierName, s.orderNumber,
          proj?.name, proj?.client,
        ])) return false;
      }
      return true;
    });
  }, [stockItems, filterLocation, filterCategory, filterStatus, query, projects]);

  // Virtuální kusy "Na cestě" — vygenerované z objednávek, které jsou objednané (status='ordered')
  // ale ještě nebyly (zcela) naskladněny.
  // Zobrazují se jen v Souhrnu (aggregated view) a jsou read-only.
  const transitItems = useMemo(() => {
    // Transit se zobrazuje jen když filter je "na cestě" nebo "vše" (jinak jen skutečné kusy)
    if (filterStatus !== 'transit' && filterStatus !== 'all') return [];
    // Vynechat, pokud filtr lokace explicitně vylučuje transit
    if (filterLocation !== 'all' && filterLocation !== TRANSIT_LOCATION_ID) return [];
    const out = [];
    projects.forEach(p => {
      (p.items || []).forEach(item => {
        // Objednávka je "na cestě" pokud je ordered (ne planned, ne delivered)
        if ((item.status || 'planned') !== 'ordered') return;
        // Zjistit, jaké množství už bylo naskladněno (pro tento konkrétní order item)
        const stockedQty = stockItems
          .filter(s => s.sourceOrderItemId === item.id)
          .reduce((sum, s) => sum + (parseInt(s.batchQuantity, 10) || 1), 0);
        const orderedQty = parseFloat(item.quantity) || 0;
        const remaining = orderedQty - stockedQty;
        if (remaining <= 0) return; // vše je naskladněné
        // Aplikovat filter kategorie
        if (filterCategory !== 'all' && item.category !== filterCategory) return;
        // Aplikovat text search
        if (query.trim()) {
          const sup = suppliers.find(s => s.id === item.supplierId);
          if (!searchMatch(query, [
            item.name, item.notes, item.orderNumber, sup?.name, item.supplier, p.name, p.client,
          ])) return;
        }
        const cat = categories.find(c => c.id === item.category);
        const sup = suppliers.find(s => s.id === item.supplierId);
        // Vytvořit virtuální stock záznam (nemá skutečné id, jen zobrazovací účel)
        out.push({
          id: `transit_${item.id}`,
          isTransit: true, // příznak pro UI
          name: item.name,
          category: item.category,
          categoryName: cat?.name || '',
          locationId: TRANSIT_LOCATION_ID,
          serialNumber: '',
          batchQuantity: remaining,
          purchasePriceCZK: (parseFloat(item.unitPrice) || 0) * remaining * (item.currency === 'EUR' ? (fxRate || 25) : 1),
          receivedDate: '', // ještě nenaskladněno
          warrantyUntil: '',
          notes: `Očekáváno ${item.plannedDeliveryDate || item.paymentDueDate || 'brzy'} · Objednávka #${item.orderNumber || '(bez čísla)'}`,
          orderNumber: item.orderNumber,
          supplierId: item.supplierId,
          supplierName: sup?.name || item.supplier || '',
          sourceProjectId: p.id,
          sourceOrderItemId: item.id,
          status: 'transit', // pseudo-status
          projectName: p.name,
        });
      });
    });
    return out;
  }, [projects, stockItems, categories, suppliers, filterStatus, filterLocation, filterCategory, query, fxRate]);

  // Agregace: sečteme kusy se stejným názvem + kategorií + lokací + stavem
  // (různé stavy nebo lokace zůstávají odděleně, aby uživatel viděl "10 v Sklad + 5 u Elektrikáře")
  const groupedItems = useMemo(() => {
    const map = new Map();
    // Skutečné skladové kusy + virtuální "na cestě"
    const combined = [...filteredItems, ...transitItems];
    combined.forEach(s => {
      const nameLower = (s.name || '').trim().toLowerCase();
      const key = `${nameLower}__${s.category || ''}__${s.locationId || ''}__${s.status || 'available'}`;
      if (!map.has(key)) {
        map.set(key, {
          key,
          groupName: s.name || '(bez názvu)',
          categoryId: s.category,
          locationId: s.locationId,
          status: s.status || 'available',
          isTransit: !!s.isTransit,
          items: [],
          totalCount: 0,
          totalValueCZK: 0,
          minPrice: Infinity,
          maxPrice: -Infinity,
          hasSerials: false,
        });
      }
      const g = map.get(key);
      const qty = parseInt(s.batchQuantity, 10) || 1;
      g.items.push(s);
      g.totalCount += qty;
      const price = parseFloat(s.purchasePriceCZK) || 0;
      g.totalValueCZK += price;
      if (price > 0) {
        g.minPrice = Math.min(g.minPrice, price / qty);
        g.maxPrice = Math.max(g.maxPrice, price / qty);
      }
      if (s.serialNumber) g.hasSerials = true;
    });
    const out = Array.from(map.values()).map(g => ({
      ...g,
      minPrice: g.minPrice === Infinity ? 0 : g.minPrice,
      maxPrice: g.maxPrice === -Infinity ? 0 : g.maxPrice,
    }));
    // Řadit: transit dolů, ostatní podle názvu
    out.sort((a, b) => {
      if (a.isTransit && !b.isTransit) return 1;
      if (!a.isTransit && b.isTransit) return -1;
      return a.groupName.localeCompare(b.groupName, 'cs');
    });
    return out;
  }, [filteredItems, transitItems]);

  // Statistiky
  const stats = useMemo(() => {
    const available = stockItems.filter(s => s.status !== 'consumed');
    const totalValue = available.reduce((s, item) => s + (parseFloat(item.purchasePriceCZK) || 0), 0);
    // Počet kusů: batchQuantity bere v úvahu (1 batch = N kusů, jednotlivý záznam = 1 kus)
    const totalUnits = available.reduce((s, item) => s + (parseInt(item.batchQuantity, 10) || 1), 0);
    const totalRecords = available.length;

    // Pro každou lokaci: počet kusů + celková hodnota (v Kč)
    const byLocation = locations.reduce((acc, loc) => {
      const items = available.filter(s => s.locationId === loc.id);
      acc[loc.id] = {
        count: items.reduce((sum, i) => sum + (parseInt(i.batchQuantity, 10) || 1), 0),
        value: items.reduce((sum, i) => sum + (parseFloat(i.purchasePriceCZK) || 0), 0),
      };
      return acc;
    }, {});

    // Přidat statistiku "Na cestě" — z objednávek, které jsou objednané, ale nenaskladněné
    let transitCount = 0;
    let transitValue = 0;
    projects.forEach(p => {
      (p.items || []).forEach(item => {
        if ((item.status || 'planned') !== 'ordered') return;
        const stockedQty = stockItems
          .filter(s => s.sourceOrderItemId === item.id)
          .reduce((sum, s) => sum + (parseInt(s.batchQuantity, 10) || 1), 0);
        const remaining = (parseFloat(item.quantity) || 0) - stockedQty;
        if (remaining <= 0) return;
        transitCount += remaining;
        const priceCZK = (parseFloat(item.unitPrice) || 0) * remaining * (item.currency === 'EUR' ? (fxRate || 25) : 1);
        transitValue += priceCZK;
      });
    });
    if (byLocation[TRANSIT_LOCATION_ID]) {
      byLocation[TRANSIT_LOCATION_ID] = { count: transitCount, value: transitValue };
    }

    const today = todayISO();
    const warrantyExpiringSoon = available.filter(s => {
      if (!s.warrantyUntil) return false;
      const days = daysBetween(s.warrantyUntil, today);
      return days >= 0 && days <= 90;
    }).length;
    const warrantyExpired = available.filter(s => s.warrantyUntil && s.warrantyUntil < today).length;
    return { totalCount: totalUnits, totalRecords, totalValue, byLocation, warrantyExpiringSoon, warrantyExpired };
  }, [stockItems, locations, projects, fxRate]);

  // Filtry pro tabulku pohybů (per-sloupec)
  const [mvFilters, setMvFilters] = useState({
    dateFrom: '',
    dateTo: '',
    type: 'all',
    item: '',
    serial: '',
    from: 'all',
    to: 'all', // location id | 'project:xxx' | 'all' | 'anyProject'
    notes: '',
  });

  const recentMovements = useMemo(() => {
    return [...stockMovements].sort((a, b) => (b.createdAt || b.date).localeCompare(a.createdAt || a.date));
  }, [stockMovements]);

  // Filtrované pohyby podle mvFilters
  const filteredMovements = useMemo(() => {
    return recentMovements.filter(m => {
      // Datum
      if (mvFilters.dateFrom && (m.date || '') < mvFilters.dateFrom) return false;
      if (mvFilters.dateTo && (m.date || '') > mvFilters.dateTo) return false;
      // Typ
      if (mvFilters.type !== 'all' && m.type !== mvFilters.type) return false;
      // Položka (text)
      if (mvFilters.item.trim() && !searchMatch(mvFilters.item, [m.itemName])) return false;
      // Sériové (text)
      if (mvFilters.serial.trim() && !searchMatch(mvFilters.serial, [m.serialNumber])) return false;
      // Z lokace
      if (mvFilters.from !== 'all') {
        if (mvFilters.from === '__empty__') { if (m.fromLocationId) return false; }
        else if (m.fromLocationId !== mvFilters.from) return false;
      }
      // Do (může být locationId nebo projekt)
      if (mvFilters.to !== 'all') {
        if (mvFilters.to === '__empty__') { if (m.toLocationId || m.projectId) return false; }
        else if (mvFilters.to === 'anyProject') { if (!m.projectId) return false; }
        else if (mvFilters.to.startsWith('project:')) {
          if (m.projectId !== mvFilters.to.slice(8)) return false;
        }
        else if (m.toLocationId !== mvFilters.to) return false;
      }
      // Poznámka
      if (mvFilters.notes.trim() && !searchMatch(mvFilters.notes, [m.notes])) return false;
      return true;
    });
  }, [recentMovements, mvFilters]);

  const anyMvFilterActive = mvFilters.dateFrom || mvFilters.dateTo || mvFilters.type !== 'all'
    || mvFilters.item || mvFilters.serial || mvFilters.from !== 'all' || mvFilters.to !== 'all' || mvFilters.notes;
  const resetMvFilters = () => setMvFilters({ dateFrom: '', dateTo: '', type: 'all', item: '', serial: '', from: 'all', to: 'all', notes: '' });

  return (
    <main style={styles.main}>
      <div style={styles.mainHeader}>
        <div>
          <h2 style={styles.projectTitle}><Warehouse size={20} style={{ verticalAlign: 'middle', marginRight: 8 }} /> Sklad</h2>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>
            {stats.totalCount} {stats.totalCount === 1 ? 'kus' : stats.totalCount < 5 ? 'kusy' : 'kusů'} na skladě · hodnota {fmt(stats.totalValue)}
            {stats.warrantyExpiringSoon > 0 && (
              <span style={{ marginLeft: 8, color: '#f59e0b', fontWeight: 600 }}>
                · ⚠ {stats.warrantyExpiringSoon} kusů s blížícím se koncem záruky
              </span>
            )}
          </p>
        </div>
        <div style={styles.headerActions}>
          <button
            style={styles.sortBtn}
            onClick={() => exportStockToExcel({ stockItems, stockMovements, locations, categories, projects, suppliers })}
            disabled={stockItems.length === 0}
            title="Stáhnout sklad jako Excel (přehled kusů + pohyby)"
          >
            <Download size={14} /> Export Excel
          </button>
          {!readOnly && (
            <>
              <button style={styles.sortBtn} onClick={onManageLocations}>
                <MapPin size={14} /> Lokace ({locations.length})
              </button>
              <button style={styles.primaryBtn} onClick={onAddStock}>
                <Plus size={14} /> Naskladnit ručně
              </button>
            </>
          )}
        </div>
      </div>

      {/* Souhrn po lokacích */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 16 }}>
        {locations.map(loc => {
          const locStats = stats.byLocation[loc.id] || { count: 0, value: 0 };
          const isTransit = loc.type === 'transit';
          return (
            <div key={loc.id} style={{
              padding: 14, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8,
              cursor: 'pointer',
              ...(filterLocation === loc.id ? { borderColor: '#0d3825', borderWidth: 2 } : {}),
            }} onClick={() => setFilterLocation(filterLocation === loc.id ? 'all' : loc.id)}>
              <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 4 }}>
                {isTransit ? <Truck size={12} /> : loc.type === 'warehouse' ? <Warehouse size={12} /> : <UserIcon size={12} />}
                {isTransit ? 'Objednáno' : loc.type === 'warehouse' ? 'Sklad' : 'Elektrikář'}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{loc.name}</div>
              <div style={{ fontSize: 22, fontWeight: 700, marginTop: 6, color: locStats.count > 0 ? '#0f172a' : '#cbd5e1' }}>
                {locStats.count} <span style={{ fontSize: 12, fontWeight: 400, color: '#64748b' }}>{locStats.count === 1 ? 'kus' : locStats.count < 5 ? 'kusy' : 'kusů'}</span>
              </div>
              <div style={{ fontSize: 12, color: locStats.value > 0 ? '#64748b' : '#cbd5e1', marginTop: 2 }}>
                {locStats.value > 0 ? fmt(locStats.value) : '—'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #e2e8f0', marginBottom: 12 }}>
        {[
          { id: 'overview', label: 'Přehled kusů', icon: <Package size={13} /> },
          { id: 'movements', label: `Pohyby (${stockMovements.length})`, icon: <History size={13} /> },
          { id: 'warranty', label: 'Záruky', icon: <ShieldCheck size={13} /> },
          { id: 'byOrder', label: 'Podle objednávek', icon: <ListChecks size={13} /> },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '8px 14px', fontSize: 13, fontWeight: tab === t.id ? 700 : 500,
              color: tab === t.id ? '#0d3825' : '#64748b',
              background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              borderBottom: tab === t.id ? '2px solid #0d3825' : '2px solid transparent',
              marginBottom: -1, display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          <div style={styles.searchBar}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <SearchInput value={query} onChange={setQuery} placeholder="Hledat položku, S/N, dodavatele, objednávku, projekt, klienta..." />
            </div>
            <select style={{ ...styles.input, width: 'auto', minWidth: 160 }} value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
              <option value="all">Všechny kategorie</option>
              {categories.filter(c => c.kind === 'material').map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select style={{ ...styles.input, width: 'auto', minWidth: 140 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="available">Skladem</option>
              <option value="transit">Na cestě</option>
              <option value="consumed">Spotřebováno</option>
              <option value="all">Vše</option>
            </select>
            <div style={{ fontSize: 12, color: '#64748b', marginLeft: 'auto' }}>
              {filteredItems.length + transitItems.length} / {stockItems.length} kusů
            </div>
          </div>

          {/* View mode toggle: aggregated vs detailed */}
          <div style={{ display: 'inline-flex', gap: 0, marginBottom: 12, borderRadius: 6, overflow: 'hidden', border: '1px solid #cbd5e1' }}>
            <button
              onClick={() => setViewMode('aggregated')}
              style={{
                padding: '5px 12px', fontSize: 11, fontWeight: 600, fontFamily: 'inherit',
                background: viewMode === 'aggregated' ? '#0d3825' : '#fff',
                color: viewMode === 'aggregated' ? '#fff' : '#64748b',
                border: 'none', cursor: 'pointer',
              }}
              title="Sečtené kusy podle názvu"
            >
              📦 Souhrn
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              style={{
                padding: '5px 12px', fontSize: 11, fontWeight: 600, fontFamily: 'inherit',
                background: viewMode === 'detailed' ? '#0d3825' : '#fff',
                color: viewMode === 'detailed' ? '#fff' : '#64748b',
                border: 'none', cursor: 'pointer',
              }}
              title="Každý kus samostatně"
            >
              📋 Detail
            </button>
          </div>

          {/* Bulk action bar - zobrazí se když je vybrána aspoň 1 položka */}
          {!readOnly && selected.size > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
              background: '#0d3825', color: '#fff', borderRadius: 8, marginBottom: 10,
              flexWrap: 'wrap',
            }}>
              <span style={{ fontWeight: 700, fontSize: 13 }}>
                {selected.size} {selected.size === 1 ? 'kus' : selected.size < 5 ? 'kusy' : 'kusů'} vybráno
              </span>
              <button
                onClick={() => setSelected(new Set())}
                style={{
                  padding: '4px 10px', fontSize: 11, background: 'transparent', color: '#c4ff3d',
                  border: '1px solid #c4ff3d', borderRadius: 4, cursor: 'pointer',
                }}>
                Vymazat výběr
              </button>
              <div style={{ flex: 1 }} />
              <button
                onClick={() => {
                  const items = filteredItems.filter(s => selected.has(s.id) && s.status !== 'consumed');
                  if (items.length === 0) { alert('Žádný z vybraných kusů nelze přesunout (jsou spotřebované).'); return; }
                  setBulkModal({ type: 'transfer', items });
                }}
                style={{
                  padding: '6px 12px', fontSize: 12, fontWeight: 600,
                  background: '#c4ff3d', color: '#0d3825', border: 'none', borderRadius: 4,
                  cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>
                <ArrowRight size={12} /> Přesunout
              </button>
              <button
                onClick={() => {
                  const items = filteredItems.filter(s => selected.has(s.id) && s.status !== 'consumed');
                  if (items.length === 0) { alert('Žádný z vybraných kusů nelze spotřebovat (jsou spotřebované).'); return; }
                  setBulkModal({ type: 'consume', items });
                }}
                style={{
                  padding: '6px 12px', fontSize: 12, fontWeight: 600,
                  background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 4,
                  cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>
                ✂️ Spotřebovat
              </button>
              <button
                onClick={() => {
                  const items = filteredItems.filter(s => selected.has(s.id));
                  exportStockToCSV(items, locations, categories, projects, suppliers);
                }}
                style={{
                  padding: '6px 12px', fontSize: 12, fontWeight: 600,
                  background: '#fff', color: '#0d3825', border: 'none', borderRadius: 4,
                  cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>
                <Upload size={12} style={{ transform: 'rotate(180deg)' }} /> Export CSV
              </button>
            </div>
          )}

          {filteredItems.length === 0 && transitItems.length === 0 ? (
            <div style={styles.emptyItems}>
              <Warehouse size={32} style={{ color: '#cbd5e1' }} />
              <p style={{ color: '#64748b', margin: '12px 0 0' }}>
                {stockItems.length === 0 ? 'Sklad je prázdný. Naskladněte první položku.' : 'Žádné kusy nevyhovují filtru.'}
              </p>
            </div>
          ) : viewMode === 'aggregated' ? (
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'auto', background: '#fff' }}>
              <table style={{ ...styles.table, fontSize: 12, minWidth: 1000 }}>
                <thead>
                  <tr>
                    <th style={{ ...styles.th, width: 30 }}></th>
                    <th style={styles.th}>Položka</th>
                    <th style={styles.th}>Kategorie</th>
                    <th style={styles.th}>Lokace</th>
                    <th style={styles.th}>Stav / Projekt</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Kusů</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Cena za kus (Kč)</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Celková hodnota (Kč)</th>
                    <th style={styles.th}>S/N</th>
                    {!readOnly && <th style={{ ...styles.th, width: 240 }}>Akce</th>}
                  </tr>
                </thead>
                <tbody>
                  {groupedItems.map(g => {
                    const cat = categories.find(c => c.id === g.categoryId);
                    const loc = locations.find(l => l.id === g.locationId);
                    const isExpanded = expandedGroups.has(g.key);
                    const isConsumed = g.status === 'consumed';
                    const avgPrice = g.totalCount > 0 ? g.totalValueCZK / g.totalCount : 0;
                    const priceRange = g.minPrice !== g.maxPrice
                      ? `${fmt(g.minPrice)} – ${fmt(g.maxPrice)}`
                      : fmt(avgPrice);
                    return (
                      <React.Fragment key={g.key}>
                        <tr style={{ ...styles.tr, opacity: isConsumed ? 0.5 : 1, background: isExpanded ? '#f8fafc' : undefined }}>
                          <td style={styles.td}>
                            <button
                              onClick={() => {
                                const s = new Set(expandedGroups);
                                if (isExpanded) s.delete(g.key); else s.add(g.key);
                                setExpandedGroups(s);
                              }}
                              style={{ ...styles.iconBtn, padding: 2, background: 'transparent', border: 'none' }}
                              title={isExpanded ? 'Sbalit' : 'Rozbalit'}
                            >
                              {isExpanded ? '▼' : '▶'}
                            </button>
                          </td>
                          <td style={{ ...styles.td, fontWeight: 600 }}>
                            {g.groupName}
                            {g.isTransit && <span style={{ marginLeft: 6, fontSize: 10 }}>🚚</span>}
                          </td>
                          <td style={styles.td}>
                            {cat && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color }} />
                                <span style={{ fontSize: 11 }}>{cat.name}</span>
                              </span>
                            )}
                          </td>
                          <td style={{ ...styles.td, fontSize: 11 }}>{loc?.name || '—'}</td>
                          <td style={styles.td}>
                            {g.isTransit ? (
                              <span style={{ padding: '2px 7px', borderRadius: 4, background: '#dbeafe', color: '#1d4ed8', fontSize: 10, fontWeight: 700 }}>NA CESTĚ</span>
                            ) : isConsumed ? (
                              <span style={{ padding: '2px 7px', borderRadius: 4, background: '#fee2e2', color: '#991b1b', fontSize: 10, fontWeight: 700 }}>SPOTŘEBOVÁNO</span>
                            ) : (
                              <span style={{ padding: '2px 7px', borderRadius: 4, background: '#dcfce7', color: '#15803d', fontSize: 10, fontWeight: 700 }}>SKLADEM</span>
                            )}
                          </td>
                          <td style={{ ...styles.td, textAlign: 'right', fontWeight: 700, fontSize: 14 }}>
                            <span style={{ padding: '3px 10px', borderRadius: 4, background: g.isTransit ? '#dbeafe' : (isConsumed ? '#f1f5f9' : '#dbeafe'), color: g.isTransit ? '#1d4ed8' : (isConsumed ? '#64748b' : '#1d4ed8') }}>
                              {g.totalCount}
                            </span>
                          </td>
                          <td style={{ ...styles.td, textAlign: 'right', fontSize: 11 }}>{priceRange}</td>
                          <td style={{ ...styles.td, textAlign: 'right', fontWeight: 600 }}>{fmt(g.totalValueCZK)}</td>
                          <td style={styles.td}>
                            {g.hasSerials ? (
                              <span style={{ padding: '1px 5px', borderRadius: 3, background: '#fef3c7', color: '#92400e', fontSize: 10, fontWeight: 700 }} title="Kusy mají sériové čísla — rozbalte pro detail">📝 S/N</span>
                            ) : (
                              <span style={{ color: '#cbd5e1', fontSize: 10 }}>—</span>
                            )}
                          </td>
                          {!readOnly && (
                            <td style={styles.td}>
                              {g.isTransit ? (
                                <span style={{ fontSize: 10, color: '#64748b', fontStyle: 'italic' }}>
                                  Přejít do Objednávek pro naskladnění
                                </span>
                              ) : !isConsumed && (
                                <div style={{ display: 'inline-flex', gap: 4 }}>
                                  <button
                                    onClick={() => {
                                      // Vybrat všechny kusy skupiny a otevřít bulk-transfer
                                      setBulkModal({ type: 'transfer', items: g.items });
                                    }}
                                    style={{ ...styles.sortBtn, fontSize: 10, padding: '3px 7px' }}
                                    title="Přesunout kusy — v modálu si můžete vybrat konkrétní"
                                  >
                                    <ArrowRight size={10} /> Přesun
                                  </button>
                                  <button
                                    onClick={() => {
                                      setBulkModal({ type: 'consume', items: g.items });
                                    }}
                                    style={{ ...styles.sortBtn, fontSize: 10, padding: '3px 7px', background: '#f59e0b', color: '#fff', borderColor: '#f59e0b' }}
                                    title="Spotřebovat kusy — v modálu si můžete vybrat konkrétní"
                                  >
                                    <Package size={10} /> Spotřebovat
                                  </button>
                                </div>
                              )}
                            </td>
                          )}
                        </tr>
                        {isExpanded && g.items.map(s => {
                          const isSel = selected.has(s.id);
                          const today = todayISO();
                          const warrantyDays = s.warrantyUntil ? daysBetween(s.warrantyUntil, today) : null;
                          const projId = s.consumedToProjectId || (s.sourceProjectId && !projects.find(p => p.id === s.sourceProjectId)?.isStockProject ? s.sourceProjectId : null);
                          const proj = projId ? projects.find(p => p.id === projId) : null;
                          const isConsumedRow = !!s.consumedToProjectId;
                          if (s.isTransit) {
                            // Zvláštní vzhled pro transit řádek
                            return (
                              <tr key={s.id} style={{ ...styles.tr }}>
                                <td style={styles.td}></td>
                                <td style={{ ...styles.td, paddingLeft: 22, fontSize: 11, color: '#1e40af' }} colSpan={4}>
                                  🚚 <strong>{s.batchQuantity} ks</strong> objednáno · {s.notes}
                                </td>
                                <td style={{ ...styles.td, fontSize: 11 }}>{s.projectName}</td>
                                <td style={{ ...styles.td, textAlign: 'right', fontSize: 11 }}>{s.batchQuantity}</td>
                                <td style={{ ...styles.td, textAlign: 'right', fontSize: 11 }}>{fmt(s.purchasePriceCZK)}</td>
                                <td style={{ ...styles.td, fontSize: 11 }}>{s.orderNumber || '—'}</td>
                                {!readOnly && (
                                  <td style={styles.td}>
                                    <button
                                      onClick={() => onGoToOrders && onGoToOrders(s.orderNumber, s.sourceOrderItemId)}
                                      style={{ ...styles.sortBtn, fontSize: 10, padding: '3px 7px' }}
                                      title="Přejít do Objednávek"
                                    >
                                      → Objednávka
                                    </button>
                                  </td>
                                )}
                              </tr>
                            );
                          }
                          return (
                            <tr key={s.id} style={{ ...styles.tr, background: '#fafafa' }} ref={el => rowRefs.current[s.id] = el}>
                              {/* 1. checkbox */}
                              <td style={styles.td}>
                                {!readOnly && !isConsumed && (
                                  <input
                                    type="checkbox"
                                    checked={isSel}
                                    onChange={e => {
                                      const ns = new Set(selected);
                                      if (e.target.checked) ns.add(s.id); else ns.delete(s.id);
                                      setSelected(ns);
                                    }}
                                  />
                                )}
                              </td>
                              {/* 2. Položka — index kusu */}
                              <td style={{ ...styles.td, paddingLeft: 22, fontSize: 11, color: '#64748b' }}>
                                └ kus #{g.items.indexOf(s) + 1}
                              </td>
                              {/* 3. Kategorie — datum naskladnění (per-kus meta) */}
                              <td style={{ ...styles.td, fontSize: 10, color: '#64748b' }}>
                                Naskl.: {s.receivedDate || '—'}
                              </td>
                              {/* 4. Lokace — záruka (per-kus info) */}
                              <td style={{ ...styles.td, fontSize: 10 }}>
                                {warrantyDays !== null ? (
                                  warrantyDays < 0
                                    ? <span style={{ color: '#dc2626', fontWeight: 700 }}>Záruka: prošla {-warrantyDays}d</span>
                                    : warrantyDays <= 90
                                      ? <span style={{ color: '#f59e0b', fontWeight: 700 }}>Záruka: {warrantyDays}d</span>
                                      : <span style={{ color: '#94a3b8' }}>Záruka do {s.warrantyUntil}</span>
                                ) : <span style={{ color: '#cbd5e1' }}>—</span>}
                              </td>
                              {/* 5. Stav / Projekt — badge + projekt + klient */}
                              <td style={styles.td}>
                                <div>
                                  {isConsumedRow ? (
                                    <span style={{ padding: '1px 6px', borderRadius: 3, fontSize: 10, fontWeight: 700, background: '#fee2e2', color: '#991b1b' }}>SPOTŘEB.</span>
                                  ) : (
                                    <span style={{ padding: '1px 6px', borderRadius: 3, fontSize: 10, fontWeight: 700, background: '#dcfce7', color: '#15803d' }}>SKLADEM</span>
                                  )}
                                </div>
                                {proj && (
                                  <div style={{ marginTop: 3, fontSize: 11, color: '#475569' }}>
                                    <div>{proj.name}</div>
                                    {proj.client && <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>{proj.client}</div>}
                                  </div>
                                )}
                              </td>
                              {/* 6. Kusů */}
                              <td style={{ ...styles.td, textAlign: 'right', fontSize: 11 }}>{parseInt(s.batchQuantity, 10) || 1}</td>
                              {/* 7. Cena za kus */}
                              <td style={{ ...styles.td, textAlign: 'right', fontSize: 11 }}>
                                {(() => {
                                  const qty = parseInt(s.batchQuantity, 10) || 1;
                                  const total = parseFloat(s.purchasePriceCZK) || 0;
                                  const perUnit = qty > 0 ? total / qty : total;
                                  return fmt(perUnit);
                                })()} Kč
                              </td>
                              {/* 8. Celková hodnota */}
                              <td style={{ ...styles.td, textAlign: 'right', fontSize: 11, fontWeight: 600 }}>
                                {fmt(parseFloat(s.purchasePriceCZK) || 0)} Kč
                              </td>
                              {/* 9. S/N — jen sériové číslo */}
                              <td style={{ ...styles.td, fontSize: 11, fontFamily: 'monospace' }}>
                                {s.serialNumber || <span style={{ color: '#cbd5e1', fontFamily: 'inherit' }}>—</span>}
                              </td>
                              {/* 10. Akce */}
                              {!readOnly && (
                                <td style={styles.td}>
                                  <div style={{ display: 'inline-flex', gap: 3 }}>
                                    {!isConsumed && (
                                      <>
                                        <button onClick={() => onTransferStock(s)} style={{ ...styles.iconBtn, padding: 3 }} title="Přesunout"><ArrowRight size={11} /></button>
                                        <button onClick={() => onConsumeStock(s)} style={{ ...styles.iconBtn, padding: 3 }} title="Spotřebovat"><Package size={11} /></button>
                                      </>
                                    )}
                                    <button onClick={() => onEditStock(s)} style={{ ...styles.iconBtn, padding: 3 }} title="Upravit"><Edit3 size={11} /></button>
                                    <button onClick={() => onDeleteStock(s.id)} style={{ ...styles.iconBtn, padding: 3, color: '#dc2626' }} title="Smazat"><Trash2 size={11} /></button>
                                  </div>
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'auto', background: '#fff' }}>
              <table style={{ ...styles.table, fontSize: 12, minWidth: 1100 }}>
                <thead>
                  <tr>
                    {!readOnly && (
                      <th style={{ ...styles.th, width: 30, textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={filteredItems.length > 0 && filteredItems.every(s => selected.has(s.id))}
                          onChange={e => {
                            const newSel = new Set(selected);
                            if (e.target.checked) {
                              filteredItems.forEach(s => newSel.add(s.id));
                            } else {
                              filteredItems.forEach(s => newSel.delete(s.id));
                            }
                            setSelected(newSel);
                          }}
                          title="Vybrat všechny"
                        />
                      </th>
                    )}
                    <th style={styles.th}>Položka</th>
                    <th style={styles.th}>Sériové číslo</th>
                    <th style={styles.th}>Kategorie</th>
                    <th style={styles.th}>Lokace</th>
                    <th style={styles.th}>Projekt</th>
                    <th style={styles.th}>Objednávka</th>
                    <th style={styles.th}>Dodavatel</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Cena</th>
                    <th style={styles.th}>Naskladněno</th>
                    <th style={styles.th}>Záruka do</th>
                    {!readOnly && <th style={{ ...styles.th, width: 160 }}>Akce</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map(s => {
                    const cat = categories.find(c => c.id === s.category);
                    const loc = locations.find(l => l.id === s.locationId);
                    const isConsumed = s.status === 'consumed';
                    const today = todayISO();
                    const warrantyDays = s.warrantyUntil ? daysBetween(s.warrantyUntil, today) : null;
                    const warrantyExpired = warrantyDays !== null && warrantyDays < 0;
                    const warrantyExpiring = warrantyDays !== null && warrantyDays >= 0 && warrantyDays <= 90;
                    const isSelected = selected.has(s.id);
                    return (
                      <tr
                        key={s.id}
                        ref={el => { if (el) rowRefs.current[s.id] = el; }}
                        style={{
                          ...styles.tr,
                          opacity: isConsumed ? 0.5 : 1,
                          background: focusedId === s.id ? '#fef3c7' : isSelected ? '#f0fdf4' : 'transparent',
                          outline: focusedId === s.id ? '2px solid #f59e0b' : 'none',
                          outlineOffset: focusedId === s.id ? '-2px' : '0',
                          transition: 'background 0.3s',
                        }}>
                        {!readOnly && (
                          <td style={{ ...styles.td, textAlign: 'center' }}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={e => {
                                const newSel = new Set(selected);
                                if (e.target.checked) newSel.add(s.id);
                                else newSel.delete(s.id);
                                setSelected(newSel);
                              }}
                            />
                          </td>
                        )}
                        <td style={styles.td}>
                          <div style={{ fontWeight: 500 }}>
                            {s.name}
                            {s.batchQuantity > 1 && (
                              <span style={{
                                marginLeft: 6, padding: '1px 6px', fontSize: 10, fontWeight: 700,
                                background: '#fef3c7', color: '#92400e', borderRadius: 3,
                                border: '1px solid #fcd34d',
                              }}>
                                BATCH × {s.batchQuantity} {s.unit || 'ks'}
                              </span>
                            )}
                          </div>
                          {s.notes && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{s.notes}</div>}
                        </td>
                        <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: 11 }}>
                          {s.serialNumber || <span style={{ color: '#cbd5e1' }}>—</span>}
                        </td>
                        <td style={styles.td}>
                          {cat && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
                              <span style={{ width: 6, height: 6, borderRadius: '50%', background: cat.color }} />
                              {cat.name}
                            </span>
                          )}
                        </td>
                        <td style={styles.td}>
                          <span style={{ fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            {loc?.type === 'warehouse' ? <Warehouse size={11} /> : <UserIcon size={11} />}
                            {loc?.name || '—'}
                          </span>
                          {isConsumed && (
                            <div style={{ fontSize: 10, color: '#dc2626', fontWeight: 600, marginTop: 2 }}>
                              SPOTŘEBOVÁNO
                              {s.consumedToProjectId && (() => {
                                const p = projects.find(pr => pr.id === s.consumedToProjectId);
                                return p ? <span> · {p.name}</span> : null;
                              })()}
                            </div>
                          )}
                        </td>
                        <td style={styles.td}>
                          {(() => {
                            // Priorita:
                            // 1) Pokud je spotřebováno → zobrazit cílový projekt (kam bylo spotřebováno)
                            // 2) Jinak zobrazit zdrojový projekt (pro který bylo naskladněno)
                            //    ALE pouze pokud to není systémový Sklad — ten je pro uživatele „bez projektu"
                            let projId, isConsumedProject;
                            if (s.consumedToProjectId) {
                              projId = s.consumedToProjectId;
                              isConsumedProject = true;
                            } else if (s.sourceProjectId) {
                              const src = projects.find(p => p.id === s.sourceProjectId);
                              if (src && !src.isStockProject) {
                                projId = s.sourceProjectId;
                                isConsumedProject = false;
                              }
                            }
                            const proj = projId ? projects.find(p => p.id === projId) : null;
                            if (!proj) return <span style={{ color: '#cbd5e1' }}>—</span>;
                            return (
                              <button
                                onClick={() => onGoToOrders && onGoToOrders(null, null, proj.id)}
                                style={{
                                  padding: '2px 8px', fontSize: 11, fontWeight: 600,
                                  background: isConsumedProject ? '#fee2e2' : '#dcfce7',
                                  color: isConsumedProject ? '#991b1b' : '#15803d',
                                  border: `1px solid ${isConsumedProject ? '#fca5a5' : '#86efac'}`,
                                  borderRadius: 4, cursor: 'pointer', fontFamily: 'inherit',
                                  textAlign: 'left', maxWidth: 180,
                                }}
                                title={isConsumedProject ? `Spotřebováno na projekt: ${proj.name}` : `Naskladněno pro projekt: ${proj.name}`}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <Briefcase size={11} />
                                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{proj.name}</span>
                                </div>
                                {proj.client && (
                                  <div style={{ fontSize: 10, fontWeight: 400, opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {proj.client}
                                  </div>
                                )}
                              </button>
                            );
                          })()}
                        </td>
                        <td style={styles.td}>
                          {s.orderNumber ? (
                            <button
                              onClick={() => onGoToOrders && onGoToOrders(s.orderNumber, s.sourceOrderItemId, null)}
                              style={{
                                padding: '2px 8px', fontSize: 11, fontWeight: 600,
                                background: '#dbeafe', color: '#1e40af',
                                border: '1px solid #93c5fd',
                                borderRadius: 4, cursor: 'pointer', fontFamily: 'inherit',
                                display: 'inline-flex', alignItems: 'center', gap: 4, maxWidth: 160,
                              }}
                              title={`Přejít na objednávku #${s.orderNumber}`}
                            >
                              <ShoppingCart size={11} />
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>#{s.orderNumber}</span>
                            </button>
                          ) : <span style={{ color: '#cbd5e1' }}>—</span>}
                        </td>
                        <td style={{ ...styles.td, fontSize: 12 }}>
                          {(() => {
                            const sup = s.supplierId ? suppliers.find(x => x.id === s.supplierId) : null;
                            const name = sup?.name || s.supplierName || '';
                            if (!name) return <span style={{ color: '#cbd5e1' }}>—</span>;
                            return <span style={{ color: '#475569' }}>{name}</span>;
                          })()}
                        </td>
                        <td style={{ ...styles.td, textAlign: 'right', fontWeight: 600 }}>
                          {s.purchasePriceCZK > 0 ? fmt(s.purchasePriceCZK) : <span style={{ color: '#cbd5e1' }}>—</span>}
                        </td>
                        <td style={{ ...styles.td, fontSize: 11 }}>{s.receivedDate || '—'}</td>
                        <td style={styles.td}>
                          {s.warrantyUntil ? (
                            <span style={{
                              fontSize: 11, fontWeight: 600,
                              color: warrantyExpired ? '#dc2626' : warrantyExpiring ? '#f59e0b' : '#10b981',
                            }}>
                              {s.warrantyUntil}
                              {warrantyExpired && <span style={{ marginLeft: 4 }}>(prošlá)</span>}
                              {warrantyExpiring && <span style={{ marginLeft: 4 }}>(za {warrantyDays} d)</span>}
                            </span>
                          ) : <span style={{ color: '#cbd5e1' }}>—</span>}
                        </td>
                        {!readOnly && (
                          <td style={styles.td}>
                            {confirmDeleteId === s.id ? (
                              <div style={{ display: 'inline-flex', gap: 4 }}>
                                <span style={{ fontSize: 11, color: '#dc2626', fontWeight: 600 }}>Smazat?</span>
                                <button onClick={() => { onDeleteStock(s.id); setConfirmDeleteId(null); }}
                                  style={{ ...styles.iconBtn, color: '#dc2626', background: '#fee2e2', border: '1px solid #fca5a5' }}
                                  title="Potvrdit"><Trash2 size={12} /></button>
                                <button onClick={() => setConfirmDeleteId(null)}
                                  style={{ ...styles.iconBtn, color: '#64748b' }}
                                  title="Zrušit"><X size={12} /></button>
                              </div>
                            ) : (
                              <div style={{ display: 'inline-flex', gap: 4 }}>
                                <button onClick={() => onEditStock(s)} style={{ ...styles.iconBtn, padding: '4px 8px', fontSize: 11 }} title="Upravit">
                                  <Edit3 size={12} />
                                </button>
                                {!isConsumed && (
                                  <>
                                    <button onClick={() => onTransferStock(s)} style={{ ...styles.iconBtn, padding: '4px 8px', fontSize: 11 }} title="Přesunout">
                                      <ArrowRight size={12} />
                                    </button>
                                    <button onClick={() => onConsumeStock(s)} style={{ ...styles.iconBtn, padding: '4px 8px', fontSize: 11, color: '#f59e0b' }} title="Spotřebovat na projekt">
                                      ✂️
                                    </button>
                                  </>
                                )}
                                <button onClick={() => setConfirmDeleteId(s.id)} style={{ ...styles.iconBtn, padding: '4px 8px', fontSize: 11 }} title="Smazat">
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {tab === 'movements' && (
        <div>
          {/* Filtry summary + reset */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, fontSize: 12, color: '#64748b' }}>
            <div>
              {anyMvFilterActive
                ? <>Zobrazeno <strong>{filteredMovements.length}</strong> z {recentMovements.length} pohybů (filtry aktivní)</>
                : <>Celkem <strong>{recentMovements.length}</strong> pohybů</>
              }
            </div>
            {anyMvFilterActive && (
              <button onClick={resetMvFilters} style={{ ...styles.sortBtn, fontSize: 11, padding: '3px 10px' }}>
                <X size={11} /> Vymazat filtry
              </button>
            )}
          </div>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'auto', background: '#fff' }}>
            {recentMovements.length === 0 ? (
              <div style={styles.emptyItems}>
                <History size={32} style={{ color: '#cbd5e1' }} />
                <p style={{ color: '#64748b', margin: '12px 0 0' }}>Zatím žádné pohyby na skladě.</p>
              </div>
            ) : (
              <table style={{ ...styles.table, fontSize: 12, minWidth: 1100 }}>
                <thead>
                  <tr>
                    <th style={styles.th}>Datum</th>
                    <th style={styles.th}>Typ</th>
                    <th style={styles.th}>Položka</th>
                    <th style={styles.th}>Sériové číslo</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Množství</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Částka (Kč)</th>
                    <th style={styles.th}>Z</th>
                    <th style={styles.th}>Do</th>
                    <th style={styles.th}>Poznámka</th>
                  </tr>
                  {/* Filter row */}
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={{ ...styles.th, padding: '4px 8px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <input type="date" value={mvFilters.dateFrom} onChange={e => setMvFilters({ ...mvFilters, dateFrom: e.target.value })}
                          placeholder="od" title="Od" style={{ ...styles.input, padding: '3px 5px', fontSize: 10, minWidth: 110 }} />
                        <input type="date" value={mvFilters.dateTo} onChange={e => setMvFilters({ ...mvFilters, dateTo: e.target.value })}
                          placeholder="do" title="Do" style={{ ...styles.input, padding: '3px 5px', fontSize: 10, minWidth: 110 }} />
                      </div>
                    </th>
                    <th style={{ ...styles.th, padding: '4px 8px' }}>
                      <select value={mvFilters.type} onChange={e => setMvFilters({ ...mvFilters, type: e.target.value })}
                        style={{ ...styles.input, padding: '3px 5px', fontSize: 10 }}>
                        <option value="all">Vše</option>
                        {Object.entries(MOVEMENT_TYPES).map(([k, v]) => (
                          <option key={k} value={k}>{v.label}</option>
                        ))}
                      </select>
                    </th>
                    <th style={{ ...styles.th, padding: '4px 8px' }}>
                      <input type="text" value={mvFilters.item} onChange={e => setMvFilters({ ...mvFilters, item: e.target.value })}
                        placeholder="Hledat..." style={{ ...styles.input, padding: '3px 5px', fontSize: 10 }} />
                    </th>
                    <th style={{ ...styles.th, padding: '4px 8px' }}>
                      <input type="text" value={mvFilters.serial} onChange={e => setMvFilters({ ...mvFilters, serial: e.target.value })}
                        placeholder="S/N..." style={{ ...styles.input, padding: '3px 5px', fontSize: 10, fontFamily: 'monospace' }} />
                    </th>
                    <th style={{ ...styles.th, padding: '4px 8px' }}></th>
                    <th style={{ ...styles.th, padding: '4px 8px' }}></th>
                    <th style={{ ...styles.th, padding: '4px 8px' }}>
                      <select value={mvFilters.from} onChange={e => setMvFilters({ ...mvFilters, from: e.target.value })}
                        style={{ ...styles.input, padding: '3px 5px', fontSize: 10 }}>
                        <option value="all">Vše</option>
                        <option value="__empty__">— (bez lokace)</option>
                        {locations.map(l => (
                          <option key={l.id} value={l.id}>{l.name}</option>
                        ))}
                      </select>
                    </th>
                    <th style={{ ...styles.th, padding: '4px 8px' }}>
                      <select value={mvFilters.to} onChange={e => setMvFilters({ ...mvFilters, to: e.target.value })}
                        style={{ ...styles.input, padding: '3px 5px', fontSize: 10 }}>
                        <option value="all">Vše</option>
                        <option value="__empty__">— (bez cíle)</option>
                        <option value="anyProject">Jakýkoli projekt</option>
                        <optgroup label="Lokace">
                          {locations.map(l => (
                            <option key={l.id} value={l.id}>{l.name}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Projekty">
                          {projects.filter(p => !p.isStockProject).map(p => (
                            <option key={p.id} value={`project:${p.id}`}>{p.name}</option>
                          ))}
                        </optgroup>
                      </select>
                    </th>
                    <th style={{ ...styles.th, padding: '4px 8px' }}>
                      <input type="text" value={mvFilters.notes} onChange={e => setMvFilters({ ...mvFilters, notes: e.target.value })}
                        placeholder="Hledat..." style={{ ...styles.input, padding: '3px 5px', fontSize: 10 }} />
                    </th>
                  </tr>
                </thead>
                <tbody>
                {filteredMovements.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ ...styles.td, textAlign: 'center', color: '#94a3b8', fontStyle: 'italic', padding: 24 }}>
                      Žádné pohyby nevyhovují filtru.
                    </td>
                  </tr>
                ) : filteredMovements.map(m => {
                  const fromLoc = m.fromLocationId ? locations.find(l => l.id === m.fromLocationId) : null;
                  const toLoc = m.toLocationId ? locations.find(l => l.id === m.toLocationId) : null;
                  const proj = m.projectId ? projects.find(p => p.id === m.projectId) : null;
                  const movType = MOVEMENT_TYPES[m.type] || MOVEMENT_TYPES.adjust;
                  // Dohledat cenu — přednost má snapshot v pohybu, jinak z stockItem
                  const stk = m.stockItemId ? stockItems.find(s => s.id === m.stockItemId) : null;
                  const price = m.amountCZK != null ? m.amountCZK : (stk ? parseFloat(stk.purchasePriceCZK) || 0 : 0);
                  return (
                    <tr key={m.id} style={styles.tr}>
                      <td style={{ ...styles.td, fontSize: 11, whiteSpace: 'nowrap' }}>{m.date}</td>
                      <td style={styles.td}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: movType.color, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <span>{movType.icon}</span> {movType.label}
                        </span>
                      </td>
                      <td style={styles.td}>{m.itemName}</td>
                      <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: 11 }}>{m.serialNumber || '—'}</td>
                      <td style={{ ...styles.td, textAlign: 'right', fontSize: 11 }}>{m.quantity || 1}</td>
                      <td style={{ ...styles.td, textAlign: 'right', fontSize: 11, fontWeight: 600 }}>
                        {price > 0 ? fmt(price) : <span style={{ color: '#cbd5e1', fontWeight: 400 }}>—</span>}
                      </td>
                      <td style={{ ...styles.td, fontSize: 11 }}>{fromLoc?.name || '—'}</td>
                      <td style={{ ...styles.td, fontSize: 11 }}>
                        {toLoc?.name || (proj ? `Projekt: ${proj.name}` : '—')}
                      </td>
                      <td style={{ ...styles.td, fontSize: 11, color: '#64748b' }}>{m.notes || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          </div>
        </div>
      )}

      {tab === 'warranty' && (
        <WarrantyTab stockItems={stockItems} categories={categories} locations={locations} projects={projects} />
      )}

      {tab === 'byOrder' && (
        <StockByOrderTab
          stockItems={stockItems}
          locations={locations}
          categories={categories}
          suppliers={suppliers}
          projects={projects}
          onGoToOrders={onGoToOrders}
        />
      )}

      {/* Bulk operation modals */}
      {bulkModal?.type === 'transfer' && (
        <BulkTransferModal
          items={bulkModal.items}
          locations={locations}
          onSave={(chosenItems, toLocationId, notes) => {
            onBulkTransfer(chosenItems, toLocationId, notes);
            setBulkModal(null);
            setSelected(new Set());
          }}
          onClose={() => setBulkModal(null)}
        />
      )}
      {bulkModal?.type === 'consume' && (
        <BulkConsumeModal
          items={bulkModal.items}
          projects={projects}
          locations={locations}
          onSave={(chosenItems, projectId, notes) => {
            onBulkConsume(chosenItems, projectId, notes);
            setBulkModal(null);
            setSelected(new Set());
          }}
          onClose={() => setBulkModal(null)}
        />
      )}
    </main>
  );
}

// ==========================================================================
// StockByOrderTab — seskupení skladu podle objednávek
// ==========================================================================

function StockByOrderTab({ stockItems, locations, categories, suppliers, projects, onGoToOrders }) {
  // Seskupit položky podle orderNumber
  const groups = useMemo(() => {
    const map = new Map();
    stockItems.forEach(s => {
      const key = s.orderNumber || '__noOrder__';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(s);
    });
    // Seřadit: položky s objednávkou nejdřív, podle data (sestupně)
    const arr = Array.from(map.entries()).map(([key, items]) => {
      const sample = items[0];
      const sup = sample.supplierId ? suppliers.find(sp => sp.id === sample.supplierId) : null;
      const totalValue = items.reduce((s, it) => s + (parseFloat(it.purchasePriceCZK) || 0), 0);
      const available = items.filter(it => it.status !== 'consumed').length;
      const consumed = items.filter(it => it.status === 'consumed').length;
      const latestDate = items.map(it => it.receivedDate).filter(Boolean).sort().pop() || '';
      return {
        orderNumber: key === '__noOrder__' ? null : key,
        supplierName: sup?.name || sample.supplierName || '',
        supplierId: sample.supplierId || '',
        items,
        totalValue,
        available,
        consumed,
        total: items.length,
        latestDate,
      };
    });
    arr.sort((a, b) => {
      if (!a.orderNumber && b.orderNumber) return 1;
      if (a.orderNumber && !b.orderNumber) return -1;
      return (b.latestDate || '').localeCompare(a.latestDate || '');
    });
    return arr;
  }, [stockItems, suppliers]);

  const [expanded, setExpanded] = useState(() => new Set()); // výchozí: vše sbalené

  if (groups.length === 0) {
    return (
      <div style={styles.emptyItems}>
        <Warehouse size={32} style={{ color: '#cbd5e1' }} />
        <p style={{ color: '#64748b', margin: '12px 0 0' }}>Sklad je prázdný.</p>
      </div>
    );
  }

  return (
    <div>
      <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 14px' }}>
        Skladové položky seskupené podle čísla objednávky. Kliknutím na řádek rozbalíte detail.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {groups.map(g => {
          const key = g.orderNumber || '__noOrder__';
          const isExpanded = expanded.has(key);
          return (
            <div key={key} style={{ border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', overflow: 'hidden' }}>
              <div
                style={{
                  padding: '12px 14px', cursor: 'pointer', background: g.orderNumber ? '#f0fdf4' : '#fef3c7',
                  display: 'flex', alignItems: 'center', gap: 12, borderBottom: isExpanded ? '1px solid #e2e8f0' : 'none',
                }}
                onClick={() => {
                  const ne = new Set(expanded);
                  if (ne.has(key)) ne.delete(key); else ne.add(key);
                  setExpanded(ne);
                }}
              >
                <span style={{ fontSize: 16, color: '#0d3825' }}>{isExpanded ? '▼' : '▶'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>
                    {g.orderNumber ? (
                      <>
                        <span style={{ color: '#0d3825' }}>📋 {g.orderNumber}</span>
                        {g.supplierName && <span style={{ marginLeft: 10, color: '#64748b', fontWeight: 500, fontSize: 12 }}>· {g.supplierName}</span>}
                      </>
                    ) : (
                      <span style={{ color: '#92400e' }}>⚠ Bez objednávky</span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                    {g.total} {g.total === 1 ? 'kus' : g.total < 5 ? 'kusy' : 'kusů'}
                    {' · '}
                    <strong style={{ color: '#10b981' }}>{g.available}</strong> skladem
                    {g.consumed > 0 && (<>{' · '}<strong style={{ color: '#dc2626' }}>{g.consumed}</strong> spotřebováno</>)}
                    {g.latestDate && <> · poslední naskladnění {g.latestDate}</>}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0d3825' }}>{fmt(g.totalValue)}</div>
                </div>
                {g.orderNumber && (
                  <button
                    onClick={e => { e.stopPropagation(); onGoToOrders && onGoToOrders(g.orderNumber, null); }}
                    style={{
                      padding: '6px 10px', fontSize: 11, fontWeight: 600,
                      background: '#dbeafe', color: '#1e40af', border: '1px solid #93c5fd',
                      borderRadius: 4, cursor: 'pointer',
                    }}
                  >
                    Otevřít →
                  </button>
                )}
              </div>
              {isExpanded && (
                <div style={{ padding: '10px 14px', background: '#fff' }}>
                  <table style={{ ...styles.table, fontSize: 11 }}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Položka</th>
                        <th style={styles.th}>S/N</th>
                        <th style={styles.th}>Kategorie</th>
                        <th style={styles.th}>Lokace</th>
                        <th style={{ ...styles.th, textAlign: 'right' }}>Cena</th>
                        <th style={styles.th}>Naskladněno</th>
                      </tr>
                    </thead>
                    <tbody>
                      {g.items.map(s => {
                        const cat = categories.find(c => c.id === s.category);
                        const loc = locations.find(l => l.id === s.locationId);
                        const isConsumed = s.status === 'consumed';
                        return (
                          <tr key={s.id} style={{ ...styles.tr, opacity: isConsumed ? 0.5 : 1 }}>
                            <td style={styles.td}>{s.name}</td>
                            <td style={{ ...styles.td, fontFamily: 'monospace' }}>{s.serialNumber || '—'}</td>
                            <td style={styles.td}>
                              {cat && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: cat.color }} />
                                  {cat.name}
                                </span>
                              )}
                            </td>
                            <td style={styles.td}>
                              {isConsumed ? (
                                <span style={{ color: '#dc2626', fontWeight: 600 }}>
                                  ✓ Spotřebováno
                                  {s.consumedToProjectId && (() => {
                                    const p = projects.find(pr => pr.id === s.consumedToProjectId);
                                    return p ? <span> · {p.name}</span> : null;
                                  })()}
                                </span>
                              ) : (loc?.name || '—')}
                            </td>
                            <td style={{ ...styles.td, textAlign: 'right', fontWeight: 600 }}>
                              {s.purchasePriceCZK > 0 ? fmt(s.purchasePriceCZK) : '—'}
                            </td>
                            <td style={styles.td}>{s.receivedDate || '—'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================================================
// BulkTransferModal — přesun více kusů najednou
// ==========================================================================

function BulkTransferModal({ items, locations, onSave, onClose }) {
  const [toLocationId, setToLocationId] = useState('loc_warehouse');
  const [notes, setNotes] = useState('');
  // Výběr konkrétních kusů — ve výchozím stavu jsou vybrané všechny
  const [selectedIds, setSelectedIds] = useState(() => new Set(items.map(i => i.id)));

  const toggleOne = (id) => {
    const s = new Set(selectedIds);
    if (s.has(id)) s.delete(id); else s.add(id);
    setSelectedIds(s);
  };
  const toggleAll = () => {
    if (selectedIds.size === items.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(items.map(i => i.id)));
  };

  const chosen = items.filter(it => selectedIds.has(it.id));

  const submit = () => {
    if (!toLocationId) { alert('Vyberte cílovou lokaci.'); return; }
    if (chosen.length === 0) { alert('Vyberte alespoň jeden kus.'); return; }
    onSave(chosen, toLocationId, notes.trim());
  };

  return (
    <Modal title={`Přesun kusů`} onClose={onClose} maxWidth={640}>
      <div style={{ marginBottom: 14, padding: 10, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, fontSize: 12, color: '#166534' }}>
        Označte konkrétní kusy k přesunu (např. podle sériového čísla).
        Ve výchozím nastavení jsou vybrané <strong>všechny</strong>.
      </div>

      <div style={{ marginBottom: 12, maxHeight: 260, overflow: 'auto', border: '1px solid #e2e8f0', borderRadius: 6 }}>
        <table style={{ ...styles.table, fontSize: 11 }}>
          <thead>
            <tr>
              <th style={{ ...styles.th, width: 30, textAlign: 'center' }}>
                <input type="checkbox" checked={selectedIds.size === items.length && items.length > 0}
                  onChange={toggleAll} title="Vybrat vše"/>
              </th>
              <th style={styles.th}>Sériové číslo</th>
              <th style={styles.th}>Lokace</th>
              <th style={styles.th}>Naskladněno</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Množství</th>
            </tr>
          </thead>
          <tbody>
            {items.map(it => {
              const loc = locations.find(l => l.id === it.locationId);
              const isSel = selectedIds.has(it.id);
              return (
                <tr key={it.id} style={{ ...styles.tr, background: isSel ? '#f0fdf4' : undefined, cursor: 'pointer' }}
                  onClick={() => toggleOne(it.id)}>
                  <td style={styles.td}>
                    <input type="checkbox" checked={isSel} onChange={() => toggleOne(it.id)}
                      onClick={e => e.stopPropagation()} />
                  </td>
                  <td style={{ ...styles.td, fontFamily: 'monospace' }}>
                    {it.serialNumber || <span style={{ color: '#cbd5e1' }}>(bez S/N)</span>}
                  </td>
                  <td style={{ ...styles.td, fontSize: 11 }}>{loc?.name || '—'}</td>
                  <td style={{ ...styles.td, fontSize: 11 }}>{it.receivedDate || '—'}</td>
                  <td style={{ ...styles.td, textAlign: 'right' }}>{parseInt(it.batchQuantity, 10) || 1}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: 10, fontSize: 12, color: '#0d3825', fontWeight: 600 }}>
        Vybráno: <strong>{chosen.length}</strong> z {items.length} kusů
      </div>

      <div style={styles.formRow}>
        <label style={styles.label}>Cílová lokace *</label>
        <select style={styles.input} value={toLocationId} onChange={e => setToLocationId(e.target.value)}>
          {locations.map(l => (
            <option key={l.id} value={l.id}>
              {l.type === 'warehouse' ? '🏢 ' : '👷 '}{l.name}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.formRow}>
        <label style={styles.label}>Poznámka k přesunu</label>
        <input style={styles.input} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Důvod přesunu, paleta č. ..." />
      </div>

      <div style={styles.modalActions}>
        <button style={styles.secondaryBtn} onClick={onClose}>Zrušit</button>
        <button style={styles.primaryBtn} onClick={submit} disabled={chosen.length === 0}>
          <ArrowRight size={14} /> Přesunout {chosen.length} {chosen.length === 1 ? 'kus' : 'kusů'}
        </button>
      </div>
    </Modal>
  );
}

// ==========================================================================
// BulkConsumeModal — spotřeba více kusů najednou na projekt
// ==========================================================================

function BulkConsumeModal({ items, projects, locations, onSave, onClose }) {
  const [projectId, setProjectId] = useState(() => projects.find(p => p.status === 'active' && !p.isStockProject)?.id || '');
  const [notes, setNotes] = useState('');
  const [selectedIds, setSelectedIds] = useState(() => new Set(items.map(i => i.id)));

  const toggleOne = (id) => {
    const s = new Set(selectedIds);
    if (s.has(id)) s.delete(id); else s.add(id);
    setSelectedIds(s);
  };
  const toggleAll = () => {
    if (selectedIds.size === items.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(items.map(i => i.id)));
  };

  const chosen = items.filter(it => selectedIds.has(it.id));
  const totalValue = chosen.reduce((s, it) => s + (parseFloat(it.purchasePriceCZK) || 0), 0);

  const submit = () => {
    if (!projectId) { alert('Vyberte projekt.'); return; }
    if (chosen.length === 0) { alert('Vyberte alespoň jeden kus.'); return; }
    onSave(chosen, projectId, notes.trim());
  };

  return (
    <Modal title={`Spotřeba kusů na projekt`} onClose={onClose} maxWidth={640}>
      <div style={{ marginBottom: 14, padding: 10, background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 6, fontSize: 12, color: '#92400e' }}>
        <strong>⚠ Pozor:</strong> spotřebovaných kusů již nelze vzít zpět. Vyberte konkrétní kusy (např. podle sériového čísla), které jste použili.
      </div>

      <div style={styles.formRow}>
        <label style={styles.label}>Projekt *</label>
        <select style={styles.input} value={projectId} onChange={e => setProjectId(e.target.value)}>
          <option value="">— Vyberte projekt —</option>
          {[...projects].sort((a, b) => {
            if (a.isStockProject && !b.isStockProject) return -1;
            if (!a.isStockProject && b.isStockProject) return 1;
            return 0;
          }).filter(p => p.status === 'active').map(p => (
            <option key={p.id} value={p.id}>{p.isStockProject ? '🏭 ' : ''}{p.name}{p.client && ` (${p.client})`}</option>
          ))}
        </select>
      </div>

      <div style={styles.formRow}>
        <label style={styles.label}>Poznámka ke spotřebě</label>
        <input style={styles.input} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Důvod spotřeby, technik..." />
      </div>

      <div style={{ marginBottom: 8, fontSize: 12, color: '#0d3825', fontWeight: 600 }}>
        Vybrat kusy ({chosen.length} z {items.length}):
      </div>

      <div style={{ maxHeight: 240, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: 6, marginBottom: 12 }}>
        <table style={{ ...styles.table, fontSize: 11 }}>
          <thead>
            <tr>
              <th style={{ ...styles.th, width: 30, textAlign: 'center' }}>
                <input type="checkbox" checked={selectedIds.size === items.length && items.length > 0}
                  onChange={toggleAll} title="Vybrat vše"/>
              </th>
              <th style={styles.th}>Sériové číslo</th>
              <th style={styles.th}>Lokace</th>
              <th style={styles.th}>Naskladněno</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Cena (Kč)</th>
            </tr>
          </thead>
          <tbody>
            {items.map(it => {
              const loc = locations?.find(l => l.id === it.locationId);
              const isSel = selectedIds.has(it.id);
              return (
                <tr key={it.id} style={{ ...styles.tr, background: isSel ? '#fef3c7' : undefined, cursor: 'pointer' }}
                  onClick={() => toggleOne(it.id)}>
                  <td style={styles.td}>
                    <input type="checkbox" checked={isSel} onChange={() => toggleOne(it.id)}
                      onClick={e => e.stopPropagation()} />
                  </td>
                  <td style={{ ...styles.td, fontFamily: 'monospace' }}>
                    {it.serialNumber || <span style={{ color: '#cbd5e1' }}>(bez S/N)</span>}
                  </td>
                  <td style={{ ...styles.td, fontSize: 11 }}>{loc?.name || '—'}</td>
                  <td style={{ ...styles.td, fontSize: 11 }}>{it.receivedDate || '—'}</td>
                  <td style={{ ...styles.td, textAlign: 'right' }}>{fmt(parseFloat(it.purchasePriceCZK) || 0)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: 10, fontSize: 12, color: '#92400e', fontWeight: 600 }}>
        Celková hodnota spotřebovaného materiálu: <strong>{fmt(totalValue)}</strong>
      </div>

      <div style={styles.modalActions}>
        <button style={styles.secondaryBtn} onClick={onClose}>Zrušit</button>
        <button style={styles.primaryBtn} onClick={submit} disabled={chosen.length === 0}>
          ✂️ Spotřebovat {chosen.length} {chosen.length === 1 ? 'kus' : 'kusů'}
        </button>
      </div>
    </Modal>
  );
}

// ==========================================================================
// Export skladu do CSV
// ==========================================================================

function exportStockToCSV(items, locations, categories, projects, suppliers) {
  if (items.length === 0) { alert('Vyberte alespoň jednu položku pro export.'); return; }
  const today = todayISO();
  const headers = [
    'Název', 'Sériové číslo', 'Kategorie', 'Lokace', 'Stav',
    'Cena (CZK)', 'Naskladněno', 'Záruka do', 'Dnů do konce záruky',
    'Č. objednávky', 'Dodavatel', 'Projekt (spotřebováno)', 'Poznámka'
  ];
  const rows = items.map(s => {
    const cat = categories.find(c => c.id === s.category);
    const loc = locations.find(l => l.id === s.locationId);
    const sup = s.supplierId ? suppliers.find(sp => sp.id === s.supplierId) : null;
    const proj = s.consumedToProjectId ? projects.find(p => p.id === s.consumedToProjectId) : null;
    const days = s.warrantyUntil ? daysBetween(s.warrantyUntil, today) : '';
    return [
      s.name || '',
      s.serialNumber || '',
      cat?.name || '',
      loc?.name || '',
      s.status === 'consumed' ? 'Spotřebováno' : 'Skladem',
      s.purchasePriceCZK || 0,
      s.receivedDate || '',
      s.warrantyUntil || '',
      days === '' ? '' : days,
      s.orderNumber || '',
      sup?.name || s.supplierName || '',
      proj?.name || '',
      s.notes || '',
    ];
  });

  // CSV s českým středníkem (Excel CZ kompatibilní)
  const csvEscape = (v) => {
    const s = String(v ?? '');
    if (s.includes(';') || s.includes('"') || s.includes('\n')) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };
  const csv = '\uFEFF' + // BOM pro správné zobrazení v Excelu
    headers.map(csvEscape).join(';') + '\n' +
    rows.map(r => r.map(csvEscape).join(';')).join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sklad_${today}.csv`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function WarrantyTab({ stockItems, categories, locations, projects }) {
  const today = todayISO();
  const itemsWithWarranty = stockItems.filter(s => s.warrantyUntil);

  const expired = itemsWithWarranty.filter(s => s.warrantyUntil < today);
  const expiring30 = itemsWithWarranty.filter(s => {
    const d = daysBetween(s.warrantyUntil, today);
    return d >= 0 && d <= 30;
  });
  const expiring90 = itemsWithWarranty.filter(s => {
    const d = daysBetween(s.warrantyUntil, today);
    return d > 30 && d <= 90;
  });
  const valid = itemsWithWarranty.filter(s => {
    const d = daysBetween(s.warrantyUntil, today);
    return d > 90;
  });

  const Section = ({ title, items, color, count }) => (
    <div style={{ marginBottom: 16 }}>
      <h3 style={{ margin: '0 0 8px', fontSize: 14, color, display: 'flex', alignItems: 'center', gap: 8 }}>
        <ShieldCheck size={14} /> {title} ({count})
      </h3>
      {items.length === 0 ? (
        <div style={{ padding: 12, color: '#94a3b8', fontSize: 12, fontStyle: 'italic' }}>Žádné položky</div>
      ) : (
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'auto', background: '#fff' }}>
          <table style={{ ...styles.table, fontSize: 12, minWidth: 700 }}>
            <thead>
              <tr>
                <th style={styles.th}>Položka</th>
                <th style={styles.th}>Sériové č.</th>
                <th style={styles.th}>Záruka do</th>
                <th style={styles.th}>Stav</th>
                <th style={styles.th}>Lokace</th>
              </tr>
            </thead>
            <tbody>
              {items.map(s => {
                const days = daysBetween(s.warrantyUntil, today);
                const loc = locations.find(l => l.id === s.locationId);
                const proj = s.consumedToProjectId ? projects.find(p => p.id === s.consumedToProjectId) : null;
                return (
                  <tr key={s.id} style={styles.tr}>
                    <td style={styles.td}>{s.name}</td>
                    <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: 11 }}>{s.serialNumber || '—'}</td>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{s.warrantyUntil}</td>
                    <td style={{ ...styles.td, fontSize: 11, color }}>
                      {days < 0 ? `${-days} dnů po záruce` : days === 0 ? 'Dnes končí' : `za ${days} dnů`}
                    </td>
                    <td style={{ ...styles.td, fontSize: 11 }}>
                      {s.status === 'consumed' && proj ? `Projekt: ${proj.name}` : (loc?.name || '—')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <Section title="Po záruce" items={expired} color="#dc2626" count={expired.length} />
      <Section title="Záruka končí do 30 dnů" items={expiring30} color="#f59e0b" count={expiring30.length} />
      <Section title="Záruka končí za 30–90 dnů" items={expiring90} color="#3b82f6" count={expiring90.length} />
      <Section title="V záruce" items={valid} color="#10b981" count={valid.length} />
    </div>
  );
}

// ==========================================================================
// Stock modaly: Add (Receive), Edit, Transfer, Consume
// ==========================================================================

function StockAddModal({ locations, categories, catalog, suppliers, projects, fxRate, fromOrderItem, onSave, onClose }) {
  // Pokud naskladňujeme z objednávky, předvyplnit pole
  const orderTotal = fromOrderItem ? toCZK(fromOrderItem.item, fxRate) : 0;
  const orderUnitPrice = fromOrderItem && fromOrderItem.item.quantity > 0 ? orderTotal / fromOrderItem.item.quantity : 0;
  const defaultQty = fromOrderItem ? Math.max(1, parseInt(fromOrderItem.item.quantity) || 1) : 1;
  const orderCategory = fromOrderItem?.item.category || '';
  // Najdi supplierId z objednávky (přes supplierName nebo přímo)
  const orderSupplierId = useMemo(() => {
    if (!fromOrderItem) return '';
    if (fromOrderItem.item.supplierId) return fromOrderItem.item.supplierId;
    if (fromOrderItem.supplierName) {
      const s = suppliers.find(sp => sp.name === fromOrderItem.supplierName);
      return s?.id || '';
    }
    return '';
  }, [fromOrderItem, suppliers]);

  const [quantity, setQuantity] = useState(defaultQty);
  const [name, setName] = useState(fromOrderItem?.item.name || '');
  const [category, setCategory] = useState(orderCategory);
  // Režim naskladnění: 'individual' (po kusech, vznikne N záznamů) / 'batch' (1 záznam, celková hodnota)
  // Inteligentní default: per-kus pro kategorie vyžadující S/N (panely, měniče, baterie),
  // batch pro ostatní (kabely, drobný materiál, atd.)
  const [receiveMode, setReceiveMode] = useState(() =>
    SERIAL_REQUIRED_CATEGORIES.includes(orderCategory) ? 'individual' : 'batch'
  );
  const [supplierName, setSupplierName] = useState(fromOrderItem?.supplierName || '');
  const [supplierId, setSupplierId] = useState(orderSupplierId);
  const [orderNumber, setOrderNumber] = useState(fromOrderItem?.item.orderNumber || '');
  const [locationId, setLocationId] = useState('loc_warehouse');
  const [receivedDate, setReceivedDate] = useState(fromOrderItem?.item.deliveredDate || todayISO());
  const [purchasePriceCZK, setPurchasePriceCZK] = useState(orderUnitPrice);
  const [warrantyYears, setWarrantyYears] = useState(0);
  const [warrantyUntil, setWarrantyUntil] = useState('');
  const [notes, setNotes] = useState('');
  const [movementNotes, setMovementNotes] = useState(fromOrderItem ? `Naskladnění z objednávky ${fromOrderItem.item.orderNumber || ''}` : '');
  // Sériová čísla jako pole stringů (jeden pro každý kus)
  const [serials, setSerials] = useState(() => Array(defaultQty).fill(''));

  // Když uživatel změní kategorii, předvolíme režim podle ní
  useEffect(() => {
    setReceiveMode(SERIAL_REQUIRED_CATEGORIES.includes(category) ? 'individual' : 'batch');
  }, [category]);

  // ===== S/N input modes =====
  const [snTab, setSnTab] = useState('manual'); // 'manual' | 'bulk' | 'excel' | 'scanner'
  const [bulkText, setBulkText] = useState('');
  const [excelError, setExcelError] = useState('');
  const [excelLoading, setExcelLoading] = useState(false);
  const [scannerError, setScannerError] = useState('');
  const [scannerActive, setScannerActive] = useState(false);
  const videoRef = useRef(null);
  const scannerStreamRef = useRef(null);

  // Když se změní počet, upravit pole serials
  const handleQuantityChange = (v) => {
    const n = Math.max(1, parseInt(v, 10) || 1);
    setQuantity(n);
    setSerials(prev => {
      if (prev.length === n) return prev;
      if (prev.length < n) return [...prev, ...Array(n - prev.length).fill('')];
      return prev.slice(0, n);
    });
  };

  // Když je nastavena záruka v letech, automaticky spočítej datum
  const handleWarrantyYearsChange = (v) => {
    const years = parseInt(v, 10) || 0;
    setWarrantyYears(years);
    if (years > 0 && receivedDate) {
      const d = new Date(receivedDate + 'T00:00:00Z');
      d.setUTCFullYear(d.getUTCFullYear() + years);
      setWarrantyUntil(d.toISOString().slice(0, 10));
    }
  };

  // ===== Bulk paste handler =====
  const applyBulkSerials = () => {
    const lines = bulkText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) { alert('Nejsou rozpoznána žádná sériová čísla.'); return; }

    // Pokud je řádků více než kusů, navrhnout úpravu počtu
    if (lines.length !== quantity) {
      const confirm = window.confirm(
        `Rozpoznáno ${lines.length} sériových čísel, ale aktuální počet kusů je ${quantity}. ` +
        `Chcete upravit počet kusů na ${lines.length}?`
      );
      if (confirm) {
        setQuantity(lines.length);
        setSerials(lines);
      } else {
        // Vzít jen prvních N nebo doplnit prázdnými
        const adjusted = lines.slice(0, quantity);
        while (adjusted.length < quantity) adjusted.push('');
        setSerials(adjusted);
      }
    } else {
      setSerials(lines);
    }
    setSnTab('manual'); // přepnout zpět na manuální pro vizuální kontrolu
  };

  // ===== Excel import S/N =====
  const handleExcelFile = async (file) => {
    setExcelError(''); setExcelLoading(true);
    try {
      const ext = (file.name.split('.').pop() || '').toLowerCase();
      let allRows;
      if (ext === 'csv' || ext === 'tsv' || ext === 'txt') {
        const text = await file.text();
        const sep = ext === 'tsv' ? '\t' : (text.split('\n')[0].includes(';') ? ';' : ',');
        allRows = text.trim().split(/\r?\n/).map(line => parseCSVLine(line, sep));
      } else {
        const XLSX = await loadXLSX();
        const arrayBuffer = await file.arrayBuffer();
        const wb = XLSX.read(arrayBuffer, { type: 'array' });
        const firstSheet = wb.Sheets[wb.SheetNames[0]];
        allRows = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' });
      }
      if (!allRows || allRows.length === 0) {
        throw new Error('Soubor je prázdný.');
      }

      // Heuristika: najít sloupec se sériovými čísly
      // 1) Hledat v hlavičkách (první řádek) — pokud obsahuje "serial", "sériové", "S/N"
      let snColIdx = -1;
      let dataStartRow = 0;
      if (allRows[0]) {
        const headers = allRows[0].map(h => String(h || '').toLowerCase().trim());
        for (let i = 0; i < headers.length; i++) {
          if (/s[ée]riov|serial|s\/n|sn$|^sn\b|seriov/i.test(headers[i])) {
            snColIdx = i;
            dataStartRow = 1;
            break;
          }
        }
      }
      // 2) Pokud nenalezeno, vzít první sloupec
      if (snColIdx === -1) snColIdx = 0;

      const sns = [];
      for (let r = dataStartRow; r < allRows.length; r++) {
        const val = String(allRows[r]?.[snColIdx] || '').trim();
        if (val && !/^(s[ée]riov|serial|s\/n|sn)$/i.test(val)) sns.push(val);
      }

      if (sns.length === 0) throw new Error('Nebyla rozpoznána žádná sériová čísla.');

      // Aplikovat - stejně jako bulk paste
      if (sns.length !== quantity) {
        const confirm = window.confirm(
          `V souboru je ${sns.length} sériových čísel, ale aktuální počet kusů je ${quantity}. ` +
          `Chcete upravit počet kusů na ${sns.length}?`
        );
        if (confirm) {
          setQuantity(sns.length);
          setSerials(sns);
        } else {
          const adjusted = sns.slice(0, quantity);
          while (adjusted.length < quantity) adjusted.push('');
          setSerials(adjusted);
        }
      } else {
        setSerials(sns);
      }
      setSnTab('manual');
    } catch (e) {
      setExcelError('Chyba při čtení souboru: ' + (e?.message || 'neznámá chyba'));
    } finally {
      setExcelLoading(false);
    }
  };

  // ===== Scanner (camera barcode) =====
  const startScanner = async () => {
    setScannerError('');
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Vaše zařízení nepodporuje přístup ke kameře.');
      }
      // Načíst BarcodeDetector nebo fallback
      const hasBarcodeDetector = typeof window !== 'undefined' && 'BarcodeDetector' in window;
      if (!hasBarcodeDetector) {
        throw new Error('Tento prohlížeč nepodporuje skenování čárových kódů (Chrome/Edge na Android funguje, Safari iOS bohužel ne). Použijte hromadné vložení nebo Excel.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } }
      });
      scannerStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setScannerActive(true);

      // Detekční smyčka
      const detector = new window.BarcodeDetector({
        formats: ['code_128', 'code_39', 'code_93', 'codabar', 'ean_13', 'ean_8', 'itf', 'qr_code', 'upc_a', 'upc_e', 'data_matrix'],
      });
      const detected = new Set(serials.filter(Boolean));
      let active = true;
      const scan = async () => {
        if (!active || !videoRef.current) return;
        try {
          const codes = await detector.detect(videoRef.current);
          for (const code of codes) {
            const v = code.rawValue?.trim();
            if (v && !detected.has(v)) {
              detected.add(v);
              const next = [...serials];
              // Najít první prázdné pole
              const emptyIdx = next.findIndex(s => !s);
              if (emptyIdx >= 0) {
                next[emptyIdx] = v;
              } else {
                // Žádné prázdné, přidat na konec (a zvýšit počet)
                next.push(v);
                setQuantity(prev => Math.max(prev, next.length));
              }
              setSerials(next);
              // Audio feedback
              try {
                const audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ==');
                audio.play().catch(() => {});
              } catch {}
            }
          }
        } catch (e) {
          // Detection error, ignore and retry
        }
        if (active) requestAnimationFrame(scan);
      };
      requestAnimationFrame(scan);

      // Cleanup function
      return () => { active = false; };
    } catch (e) {
      setScannerError(e?.message || 'Nepodařilo se spustit kameru.');
      setScannerActive(false);
    }
  };

  const stopScanner = () => {
    if (scannerStreamRef.current) {
      scannerStreamRef.current.getTracks().forEach(t => t.stop());
      scannerStreamRef.current = null;
    }
    setScannerActive(false);
  };

  // Stop scanner on unmount
  useEffect(() => {
    return () => stopScanner();
  }, []);

  // Stop scanner when switching tabs
  useEffect(() => {
    if (snTab !== 'scanner' && scannerActive) stopScanner();
  }, [snTab]);

  const isSerialRequired = SERIAL_REQUIRED_CATEGORIES.includes(category);

  const submit = () => {
    if (!name.trim()) { alert('Zadejte název položky'); return; }
    if (!category) { alert('Vyberte kategorii'); return; }

    const unitPrice = parseFloat(purchasePriceCZK) || 0;
    const items = [];

    if (receiveMode === 'batch') {
      // BATCH režim: 1 záznam s celkovou hodnotou pro daný počet kusů
      // Použito např. pro kabely, drobný materiál - 22 ks kabelů jako 1 batch
      const totalValue = unitPrice * quantity;
      items.push({
        id: uid('stk'),
        name: name.trim(),
        category,
        serialNumber: '', // batch nemá S/N
        batchQuantity: quantity, // počet kusů v batch (informativní)
        unit: fromOrderItem?.item.unit || 'ks',
        supplierName: supplierName.trim(),
        supplierId: supplierId || '',
        orderNumber: orderNumber.trim(),
        locationId,
        receivedDate,
        purchasePriceCZK: totalValue, // CELKOVÁ hodnota batche
        warrantyUntil: warrantyUntil || '',
        notes: notes.trim(),
        sourceOrderItemId: fromOrderItem?.item.id || null,
        sourceProjectId: fromOrderItem?.projectId || null,
        status: 'available',
      });
    } else {
      // INDIVIDUAL režim: jeden stockItem pro každý kus
      // S/N je "doporučené" pro některé kategorie (panels/inverters/batteries), ale ne blokující.
      const missingSerials = [];
      for (let i = 0; i < quantity; i++) {
        const sn = (serials[i] || '').trim();
        if (isSerialRequired && !sn) missingSerials.push(i + 1);
        items.push({
          id: uid('stk'),
          name: name.trim(),
          category,
          serialNumber: sn,
          batchQuantity: 1,
          unit: fromOrderItem?.item.unit || 'ks',
          supplierName: supplierName.trim(),
          supplierId: supplierId || '',
          orderNumber: orderNumber.trim(),
          locationId,
          receivedDate,
          purchasePriceCZK: unitPrice,
          warrantyUntil: warrantyUntil || '',
          notes: notes.trim(),
          sourceOrderItemId: fromOrderItem?.item.id || null,
          sourceProjectId: fromOrderItem?.projectId || null,
          status: 'available',
        });
      }
      if (missingSerials.length > 0) {
        const catName = categories.find(c => c.id === category)?.name || category;
        const msg = missingSerials.length === quantity
          ? `Kategorie ${catName} obvykle vyžaduje sériové číslo, ale žádný kus (${quantity} ks) ho nemá.\n\nPokračovat s prázdnými S/N?`
          : `Kategorie ${catName} obvykle vyžaduje sériové číslo.\nChybí u ${missingSerials.length} z ${quantity} kusů (# ${missingSerials.slice(0, 5).join(', ')}${missingSerials.length > 5 ? '…' : ''}).\n\nPokračovat?`;
        if (!window.confirm(msg)) return;
      }
    }
    items.forEach(item => onSave(item, movementNotes));
  };

  return (
    <Modal title={fromOrderItem ? 'Naskladnit z objednávky' : 'Naskladnit ručně'} onClose={onClose} maxWidth={780}>
      {fromOrderItem && (
        <div style={{ padding: 10, background: '#dbeafe', color: '#1e40af', borderRadius: 6, marginBottom: 12, fontSize: 12 }}>
          Naskladnění z objednávky <strong>{fromOrderItem.item.orderNumber || '(bez čísla)'}</strong> · projekt <strong>{fromOrderItem.projectName}</strong> · dodavatel <strong>{fromOrderItem.supplierName}</strong>
        </div>
      )}

      <div style={styles.formRowGroup}>
        <div style={{ flex: 2 }}>
          <label style={styles.label}>Název položky *</label>
          <input style={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="např. JA Solar 450W" />
        </div>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Kategorie *</label>
          <select style={styles.input} value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">— Vyberte —</option>
            {categories.filter(c => c.kind === 'material').map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>{receiveMode === 'batch' ? 'Počet ks v batchi *' : 'Počet kusů *'}</label>
          <input type="number" min="1" style={styles.input} value={quantity} onChange={e => handleQuantityChange(e.target.value)} />
        </div>
      </div>

      {/* Režim naskladnění */}
      <div style={{ marginTop: 12, padding: 10, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
        <label style={{ ...styles.label, marginBottom: 8 }}>Režim naskladnění</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={() => setReceiveMode('individual')}
            style={{
              flex: 1, padding: '10px 14px', textAlign: 'left',
              background: receiveMode === 'individual' ? '#0d3825' : '#fff',
              color: receiveMode === 'individual' ? '#fff' : '#475569',
              border: `2px solid ${receiveMode === 'individual' ? '#0d3825' : '#e2e8f0'}`,
              borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>
              📦 Po kusech ({quantity}× záznam)
            </div>
            <div style={{ fontSize: 11, opacity: 0.85 }}>
              Vznikne {quantity} {quantity === 1 ? 'záznam' : quantity < 5 ? 'záznamy' : 'záznamů'} ve skladu, každý lze opatřit S/N.
              Hodí se pro panely, měniče, baterie.
            </div>
          </button>
          <button
            type="button"
            onClick={() => setReceiveMode('batch')}
            style={{
              flex: 1, padding: '10px 14px', textAlign: 'left',
              background: receiveMode === 'batch' ? '#0d3825' : '#fff',
              color: receiveMode === 'batch' ? '#fff' : '#475569',
              border: `2px solid ${receiveMode === 'batch' ? '#0d3825' : '#e2e8f0'}`,
              borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>
              📦 Jako batch (1× záznam)
            </div>
            <div style={{ fontSize: 11, opacity: 0.85 }}>
              1 záznam o {quantity} {quantity === 1 ? 'kusu' : quantity < 5 ? 'kusech' : 'kusech'} s celkovou hodnotou.
              Hodí se pro kabely, drobný materiál, dopravu.
            </div>
          </button>
        </div>
        {receiveMode === 'individual' && isSerialRequired && (
          <div style={{ marginTop: 8, fontSize: 11, color: '#92400e', background: '#fef3c7', padding: 6, borderRadius: 4 }}>
            ⚠ Pro kategorii „{categories.find(c => c.id === category)?.name}" jsou sériová čísla povinná.
          </div>
        )}
      </div>

      <div style={styles.formRowGroup}>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Dodavatel</label>
          <select style={styles.input} value={supplierId} onChange={e => {
            setSupplierId(e.target.value);
            const s = suppliers.find(sp => sp.id === e.target.value);
            if (s) setSupplierName(s.name);
          }}>
            <option value="">— Žádný —</option>
            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Číslo objednávky</label>
          <input style={styles.input} value={orderNumber} onChange={e => setOrderNumber(e.target.value)} placeholder="OBJ-2026-001" />
        </div>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Lokace *</label>
          <select style={styles.input} value={locationId} onChange={e => setLocationId(e.target.value)}>
            {locations.map(l => (
              <option key={l.id} value={l.id}>
                {l.type === 'warehouse' ? '🏢 ' : '👷 '}{l.name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Datum naskladnění *</label>
          <input type="date" style={styles.input} value={receivedDate} onChange={e => setReceivedDate(e.target.value)} />
        </div>
      </div>

      <div style={styles.formRowGroup}>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Nákupní cena za kus (CZK)</label>
          <input type="number" step="0.01" min="0" style={styles.input} value={purchasePriceCZK} onChange={e => setPurchasePriceCZK(e.target.value)} />
          {receiveMode === 'batch' && quantity > 1 && (
            <div style={{ fontSize: 11, color: '#0d3825', fontWeight: 600, marginTop: 4 }}>
              ⇒ Celková hodnota batche: <strong>{fmt((parseFloat(purchasePriceCZK) || 0) * quantity)}</strong>
            </div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Záruka (roky)</label>
          <input type="number" min="0" max="30" style={styles.input} value={warrantyYears} onChange={e => handleWarrantyYearsChange(e.target.value)} placeholder="0" />
        </div>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Záruka do (datum)</label>
          <input type="date" style={styles.input} value={warrantyUntil} onChange={e => { setWarrantyUntil(e.target.value); setWarrantyYears(0); }} />
        </div>
      </div>

      {/* Sériová čísla — tabbed input (jen v režimu po kusech) */}
      {receiveMode === 'individual' && (
      <div style={{ marginTop: 16, padding: 12, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <label style={{ ...styles.label, margin: 0 }}>
            Sériová čísla {isSerialRequired ? <span style={{ color: '#f59e0b' }}>(doporučené)</span> : '(volitelné)'}
          </label>
          <div style={{ fontSize: 11, color: '#64748b' }}>
            Vyplněno: <strong style={{ color: serials.filter(Boolean).length === quantity ? '#10b981' : '#f59e0b' }}>{serials.filter(Boolean).length}/{quantity}</strong>
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 8, borderBottom: '1px solid #e2e8f0' }}>
          {[
            { id: 'manual', label: 'Manuálně', icon: <Edit3 size={11} /> },
            { id: 'bulk', label: 'Hromadné vložení', icon: <FileText size={11} /> },
            { id: 'excel', label: 'Import z Excelu', icon: <Upload size={11} /> },
            { id: 'scanner', label: 'Skener', icon: '📷' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setSnTab(t.id)}
              style={{
                padding: '6px 10px', fontSize: 11, fontWeight: snTab === t.id ? 700 : 500,
                color: snTab === t.id ? '#0d3825' : '#64748b',
                background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                borderBottom: snTab === t.id ? '2px solid #0d3825' : '2px solid transparent',
                marginBottom: -1, display: 'inline-flex', alignItems: 'center', gap: 4,
              }}>
              {typeof t.icon === 'string' ? t.icon : t.icon} {t.label}
            </button>
          ))}
        </div>

        {snTab === 'manual' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 6 }}>
            {serials.map((sn, idx) => (
              <input
                key={idx}
                style={{ ...styles.input, fontFamily: 'monospace', fontSize: 12 }}
                placeholder={`Kus #${idx + 1} S/N`}
                value={sn}
                onChange={e => {
                  const next = [...serials];
                  next[idx] = e.target.value;
                  setSerials(next);
                }}
              />
            ))}
          </div>
        )}

        {snTab === 'bulk' && (
          <div>
            <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 6px' }}>
              Vložte sériová čísla, jedno na řádek. Můžete zkopírovat ze sloupce v Excelu.
            </p>
            <textarea
              style={{ ...styles.input, fontFamily: 'monospace', fontSize: 12, minHeight: 120, resize: 'vertical' }}
              value={bulkText}
              onChange={e => setBulkText(e.target.value)}
              placeholder={'JA240312001\nJA240312002\nJA240312003\n...'}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
              <span style={{ fontSize: 11, color: '#64748b' }}>
                Rozpoznáno: <strong>{bulkText.split(/\r?\n/).map(l => l.trim()).filter(Boolean).length}</strong> řádků
              </span>
              <button style={{ ...styles.primaryBtn, padding: '6px 12px', fontSize: 12 }} onClick={applyBulkSerials}>
                Použít sériová čísla
              </button>
            </div>
          </div>
        )}

        {snTab === 'excel' && (
          <div>
            <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 6px' }}>
              Nahrajte Excel/CSV se sériovými čísly. Aplikace najde sloupec automaticky (hledá hlavičku „Sériové č.", „S/N", apod.) nebo vezme první sloupec.
            </p>
            <input
              type="file"
              accept=".xlsx,.xls,.csv,.tsv,.txt"
              style={{ ...styles.input, padding: 6 }}
              onChange={e => {
                const f = e.target.files?.[0];
                if (f) handleExcelFile(f);
                e.target.value = '';
              }}
            />
            {excelLoading && (
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>⏳ Načítám soubor...</div>
            )}
            {excelError && (
              <div style={{ marginTop: 6, padding: 8, background: '#fee2e2', color: '#b91c1c', borderRadius: 4, fontSize: 11 }}>
                ⚠ {excelError}
              </div>
            )}
          </div>
        )}

        {snTab === 'scanner' && (
          <div>
            {!scannerActive ? (
              <div>
                <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 8px' }}>
                  📷 Skenování čárových kódů kamerou. Funguje na mobilních zařízeních s Chrome / Edge.
                  Naskenovaný kód se automaticky doplní do prvního prázdného pole.
                </p>
                <button
                  style={styles.primaryBtn}
                  onClick={startScanner}
                >
                  📷 Spustit kameru
                </button>
                {scannerError && (
                  <div style={{ marginTop: 6, padding: 8, background: '#fee2e2', color: '#b91c1c', borderRadius: 4, fontSize: 11 }}>
                    ⚠ {scannerError}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div style={{ position: 'relative', background: '#000', borderRadius: 6, overflow: 'hidden', maxHeight: 280 }}>
                  <video ref={videoRef} style={{ width: '100%', display: 'block', maxHeight: 280, objectFit: 'cover' }} playsInline muted />
                  <div style={{
                    position: 'absolute', top: '50%', left: '15%', right: '15%',
                    height: 2, background: '#dc2626', boxShadow: '0 0 8px rgba(220,38,38,0.6)',
                    transform: 'translateY(-50%)',
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                  <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>
                    🟢 Snímám... namiřte na čárový kód
                  </span>
                  <button style={styles.sortBtn} onClick={stopScanner}>Zastavit</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      )}

      <div style={{ marginTop: 12 }}>
        <label style={styles.label}>Poznámka k položce</label>
        <input style={styles.input} value={notes} onChange={e => setNotes(e.target.value)} placeholder="např. žluté pásky, kontrola výrobních čísel..." />
      </div>

      <div style={{ marginTop: 12 }}>
        <label style={styles.label}>Poznámka k pohybu (uloží se do historie)</label>
        <input style={styles.input} value={movementNotes} onChange={e => setMovementNotes(e.target.value)} placeholder="Důvod naskladnění, paleta č. ..." />
      </div>

      <div style={styles.modalActions}>
        <button style={styles.secondaryBtn} onClick={onClose}>Zrušit</button>
        <button style={styles.primaryBtn} onClick={submit}>
          <Plus size={14} /> {receiveMode === 'batch'
            ? `Naskladnit batch (${quantity} ks)`
            : `Naskladnit ${quantity} ${quantity === 1 ? 'kus' : quantity < 5 ? 'kusy' : 'kusů'}`}
        </button>
      </div>
    </Modal>
  );
}

function StockEditModal({ stockItem, locations, categories, onSave, onClose }) {
  const [form, setForm] = useState({
    name: stockItem.name || '',
    serialNumber: stockItem.serialNumber || '',
    category: stockItem.category || '',
    locationId: stockItem.locationId || 'loc_warehouse',
    purchasePriceCZK: stockItem.purchasePriceCZK || 0,
    warrantyUntil: stockItem.warrantyUntil || '',
    notes: stockItem.notes || '',
    supplierName: stockItem.supplierName || '',
  });

  const submit = () => {
    if (!form.name.trim()) { alert('Zadejte název'); return; }
    onSave({
      ...form,
      name: form.name.trim(),
      serialNumber: form.serialNumber.trim(),
      supplierName: form.supplierName.trim(),
      notes: form.notes.trim(),
      purchasePriceCZK: parseFloat(form.purchasePriceCZK) || 0,
    });
  };

  return (
    <Modal title="Upravit skladový kus" onClose={onClose} maxWidth={620}>
      <div style={styles.formRowGroup}>
        <div style={{ flex: 2 }}>
          <label style={styles.label}>Název</label>
          <input style={styles.input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Kategorie</label>
          <select style={styles.input} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            {categories.filter(c => c.kind === 'material').map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={styles.formRowGroup}>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Sériové číslo</label>
          <input style={{ ...styles.input, fontFamily: 'monospace' }} value={form.serialNumber} onChange={e => setForm({ ...form, serialNumber: e.target.value })} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Lokace</label>
          <select style={styles.input} value={form.locationId} onChange={e => setForm({ ...form, locationId: e.target.value })}>
            {locations.map(l => (
              <option key={l.id} value={l.id}>{l.type === 'warehouse' ? '🏢 ' : '👷 '}{l.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={styles.formRowGroup}>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Nákupní cena (CZK)</label>
          <input type="number" step="0.01" min="0" style={styles.input} value={form.purchasePriceCZK} onChange={e => setForm({ ...form, purchasePriceCZK: e.target.value })} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Záruka do</label>
          <input type="date" style={styles.input} value={form.warrantyUntil} onChange={e => setForm({ ...form, warrantyUntil: e.target.value })} />
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <label style={styles.label}>Dodavatel</label>
        <input style={styles.input} value={form.supplierName} onChange={e => setForm({ ...form, supplierName: e.target.value })} />
      </div>

      <div style={{ marginTop: 12 }}>
        <label style={styles.label}>Poznámka</label>
        <input style={styles.input} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
      </div>

      <div style={styles.modalActions}>
        <button style={styles.secondaryBtn} onClick={onClose}>Zrušit</button>
        <button style={styles.primaryBtn} onClick={submit}>Uložit změny</button>
      </div>
    </Modal>
  );
}

function StockTransferModal({ stockItem, locations, onConfirm, onClose }) {
  const otherLocations = locations.filter(l => l.id !== stockItem.locationId);
  const [toLocationId, setToLocationId] = useState(otherLocations[0]?.id || '');
  const [notes, setNotes] = useState('');
  const currentLoc = locations.find(l => l.id === stockItem.locationId);
  const targetLoc = locations.find(l => l.id === toLocationId);

  const submit = () => {
    if (!toLocationId) { alert('Vyberte cílovou lokaci'); return; }
    onConfirm(toLocationId, notes.trim());
  };

  return (
    <Modal title="Přesunout kus" onClose={onClose} maxWidth={520}>
      <div style={{ padding: 12, background: '#f8fafc', borderRadius: 6, marginBottom: 12 }}>
        <div style={{ fontWeight: 600 }}>{stockItem.name}</div>
        {stockItem.serialNumber && (
          <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#64748b', marginTop: 2 }}>S/N: {stockItem.serialNumber}</div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 16, marginBottom: 12 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Z</div>
          <div style={{ marginTop: 4, padding: '8px 14px', background: '#fef3c7', color: '#92400e', borderRadius: 6, fontWeight: 600, fontSize: 13 }}>
            {currentLoc?.type === 'warehouse' ? '🏢 ' : '👷 '}{currentLoc?.name}
          </div>
        </div>
        <ArrowRight size={24} style={{ color: '#0d3825' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Do</div>
          <select style={{ ...styles.input, marginTop: 4, fontWeight: 600, fontSize: 13, background: '#d1fae5', color: '#065f46', minWidth: 180 }} value={toLocationId} onChange={e => setToLocationId(e.target.value)}>
            {otherLocations.map(l => (
              <option key={l.id} value={l.id}>{l.type === 'warehouse' ? '🏢 ' : '👷 '}{l.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label style={styles.label}>Poznámka k přesunu</label>
        <input style={styles.input} value={notes} onChange={e => setNotes(e.target.value)} placeholder="např. pro instalaci na Vyšehradě..." />
      </div>

      <div style={styles.modalActions}>
        <button style={styles.secondaryBtn} onClick={onClose}>Zrušit</button>
        <button style={styles.primaryBtn} onClick={submit}>
          <ArrowRight size={14} /> Přesunout
        </button>
      </div>
    </Modal>
  );
}

function StockConsumeModal({ stockItem, projects, onConfirm, onClose }) {
  const activeProjects = projects.filter(p => (p.status || 'active') === 'active');
  const [projectId, setProjectId] = useState(activeProjects[0]?.id || '');
  const [notes, setNotes] = useState('');

  const submit = () => {
    if (!projectId) { alert('Vyberte projekt'); return; }
    onConfirm(projectId, notes.trim());
  };

  return (
    <Modal title="Spotřebovat kus na projekt" onClose={onClose} maxWidth={520}>
      <div style={{ padding: 12, background: '#f8fafc', borderRadius: 6, marginBottom: 12 }}>
        <div style={{ fontWeight: 600 }}>{stockItem.name}</div>
        {stockItem.serialNumber && (
          <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#64748b', marginTop: 2 }}>S/N: {stockItem.serialNumber}</div>
        )}
        {stockItem.purchasePriceCZK > 0 && (
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Nákupní cena: <strong>{fmt(stockItem.purchasePriceCZK)}</strong></div>
        )}
      </div>

      <div style={{ padding: 10, background: '#fef3c7', color: '#92400e', borderRadius: 6, marginBottom: 12, fontSize: 12 }}>
        ⚠ Kus bude označen jako spotřebovaný a nepůjde dál přesouvat. Pohyb se zaznamená do historie skladu.
      </div>

      <div>
        <label style={styles.label}>Projekt *</label>
        <select style={styles.input} value={projectId} onChange={e => setProjectId(e.target.value)}>
          <option value="">— Vyberte —</option>
          {activeProjects.map(p => (
            <option key={p.id} value={p.id}>{p.name}{p.client ? ` (${p.client})` : ''}</option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: 12 }}>
        <label style={styles.label}>Poznámka</label>
        <input style={styles.input} value={notes} onChange={e => setNotes(e.target.value)} placeholder="např. instalace na střechu, datum instalace..." />
      </div>

      <div style={styles.modalActions}>
        <button style={styles.secondaryBtn} onClick={onClose}>Zrušit</button>
        <button style={styles.primaryBtn} onClick={submit}>
          ✂️ Spotřebovat
        </button>
      </div>
    </Modal>
  );
}

// ==========================================================================
// CashFlowView — zjednodušená verze: jen výdaje za položky projektů (po měsících)
// ==========================================================================

function CashFlowView({ projects, categories, suppliers, fxRate, settings }) {
  const [groupBy, setGroupBy] = useState('category'); // category | project | supplier
  const [period, setPeriod] = useState('month');      // week | month
  const [dateMode, setDateMode] = useState('due');    // due | planned | order
  const [includeInvoiced, setIncludeInvoiced] = useState(false); // ve výchozím stavu vyfakturované skrýt
  const [showWithVAT, setShowWithVAT] = useState(true); // ve výchozím stavu zobrazovat s DPH (realistický cash flow)
  const [breakdownModal, setBreakdownModal] = useState(null); // { title, rows: [...], side: 'expense'|'income', vatMode }

  const periodKey = period === 'week' ? ywKey : ymKey;
  const today = todayISO();

  // DPH na nákupy — přidává se do výdajů v cash flow (typicky 21 % v ČR).
  // Položky se zadávají bez DPH, ale z účtu odejde s DPH.
  // Uživatel může DPH dočasně vypnout přepínačem v UI (showWithVAT).
  const expenseVatRate = parseFloat(settings?.expenseVatRate) || 0;
  const vatMultiplier = showWithVAT ? (1 + expenseVatRate / 100) : 1;

  const data = useMemo(() => {
    const bucketSet = new Set();
    const rows = [];

    projects.forEach(p => {
      (p.items || []).forEach(item => {
        // Vyfakturované položky jsou vedeny v saldu závazků jinde — pro cash flow je vynecháváme,
        // pokud uživatel nezapne "Zobrazit vyfakturované"
        if (!includeInvoiced && item.isInvoiced) return;
        const sup = suppliers.find(s => s.id === item.supplierId);
        const qty = parseFloat(item.quantity) || 0;
        const unitCZK = item.currency === 'EUR'
          ? (parseFloat(item.unitPrice) || 0) * fxRate
          : (parseFloat(item.unitPrice) || 0);
        const totalCZK = unitCZK * qty;
        const payments = computePayments(item, sup, totalCZK);
        payments.forEach((pay, idx) => {
          // Vybrat datum podle dateMode
          let useDate;
          if (dateMode === 'order') useDate = item.purchaseDate || item.plannedOrderDate;
          else if (dateMode === 'planned') useDate = item.plannedOrderDate || item.purchaseDate;
          else useDate = pay.dueDate;
          const b = periodKey(useDate);
          bucketSet.add(b);
          rows.push({
            id: `${item.id}_${idx}`,
            projectId: p.id,
            projectName: p.name,
            projectClient: p.client || '',
            item,
            amount: pay.amount * vatMultiplier, // <-- VÝDAJ S DPH
            amountNet: pay.amount,              // <-- pro detail / tooltip
            bucket: b,
            tranche: pay.tranche,
            overdue: !!pay.dueDate && pay.dueDate < today,
          });
        });
      });
    });

    const buckets = Array.from(bucketSet).sort((a, b) => {
      if (a === 'unscheduled') return 1;
      if (b === 'unscheduled') return -1;
      return a.localeCompare(b);
    });

    // Group rows
    const rowKeyFn = (x) => {
      if (groupBy === 'category') {
        const cat = categories.find(c => c.id === x.item.category);
        return { key: `cat_${x.item.category}`, label: cat?.name || 'Neznámé', color: cat?.color || '#94a3b8' };
      } else if (groupBy === 'project') {
        return {
          key: `proj_${x.projectId}`,
          label: x.projectName,
          sublabel: x.projectClient || '', // jméno klienta
          color: '#3b82f6',
        };
      } else if (groupBy === 'supplier') {
        const sup = suppliers.find(s => s.id === x.item.supplierId);
        return { key: `sup_${x.item.supplierId || 'none'}`, label: sup?.name || 'Bez dodavatele', color: '#dc2626' };
      }
      return { key: 'all', label: 'Vše', color: '#0f172a' };
    };

    const groupMap = new Map();
    rows.forEach(r => {
      const g = rowKeyFn(r);
      r.groupKey = g.key; // <-- pro filtrování v breakdown modalu
      if (!groupMap.has(g.key)) groupMap.set(g.key, { ...g, byBucket: {} });
      const grp = groupMap.get(g.key);
      if (!grp.byBucket[r.bucket]) grp.byBucket[r.bucket] = 0;
      grp.byBucket[r.bucket] += r.amount;
    });

    const groups = Array.from(groupMap.values()).sort((a, b) => a.label.localeCompare(b.label));

    // Totals per bucket
    const totals = {};
    buckets.forEach(b => {
      totals[b] = rows.filter(r => r.bucket === b).reduce((s, r) => s + r.amount, 0);
    });

    // Cumulative
    const cumulative = {};
    let running = 0;
    buckets.forEach(b => {
      if (b === 'unscheduled') { cumulative[b] = null; return; }
      running += totals[b] || 0;
      cumulative[b] = running;
    });

    return { buckets, groups, totals, cumulative, rows, totalRows: rows.length };
  }, [projects, categories, suppliers, fxRate, groupBy, period, dateMode, today, periodKey, includeInvoiced, vatMultiplier]);

  // ===== Příjmy od klientů (z project.clientPayments) =====
  // Klientské platby se vytvářejí z hodnoty smlouvy včetně DPH (čili amount = gross).
  // Pokud uživatel chce zobrazit "bez DPH", dělíme každou platbu (1 + project.vatRate/100).
  const incomeData = useMemo(() => {
    const bucketSet = new Set();
    const rows = [];

    projects.forEach(p => {
      const projectVatRate = parseFloat(p.vatRate) || 0;
      // Divizor pro převod gross → net: 1.21 → 1 (pokud nezobrazujeme s DPH)
      // Pokud showWithVAT = true → ponecháme částku jak je (gross)
      // Pokud showWithVAT = false → dělíme (1 + vat/100), aby byla bez DPH
      const incomeDivisor = showWithVAT ? 1 : (1 + projectVatRate / 100);

      (p.clientPayments || []).forEach(cp => {
        // status 'paid' = peníze fyzicky přišly → není to budoucí příjem
        if (cp.status === 'paid') return;

        const amount = parseFloat(cp.amount) || 0;
        if (amount === 0) return;
        const amountCZK = (cp.currency === 'EUR') ? amount * fxRate : amount;
        const adjustedAmount = amountCZK / incomeDivisor;

        const useDate = cp.dueDate;
        const b = periodKey(useDate);
        bucketSet.add(b);
        rows.push({
          id: cp.id,
          projectId: p.id,
          projectName: p.name,
          projectClient: p.client || '',
          projectVatRate,
          payment: cp,
          amount: adjustedAmount,
          amountGross: amountCZK, // pro detail
          bucket: b,
          overdue: !!cp.dueDate && cp.dueDate < today && cp.status !== 'paid',
        });
      });
    });

    const totals = {};
    bucketSet.forEach(b => {
      totals[b] = rows.filter(r => r.bucket === b).reduce((s, r) => s + r.amount, 0);
    });

    return { buckets: Array.from(bucketSet), totals, rows, totalRows: rows.length };
  }, [projects, fxRate, periodKey, today, showWithVAT]);

  // ===== Sloučená seznam bucketů (výdaje + příjmy) =====
  const allBuckets = useMemo(() => {
    const set = new Set([...data.buckets, ...incomeData.buckets]);
    return Array.from(set).sort((a, b) => {
      if (a === 'unscheduled') return 1;
      if (b === 'unscheduled') return -1;
      return a.localeCompare(b);
    });
  }, [data.buckets, incomeData.buckets]);

  // ===== Saldo (příjmy - výdaje) =====
  const balance = useMemo(() => {
    const perBucket = {};
    allBuckets.forEach(b => {
      perBucket[b] = (incomeData.totals[b] || 0) - (data.totals[b] || 0);
    });
    // Kumulativně
    const cumulative = {};
    let running = 0;
    allBuckets.forEach(b => {
      if (b === 'unscheduled') { cumulative[b] = null; return; }
      running += perBucket[b];
      cumulative[b] = running;
    });
    return { perBucket, cumulative };
  }, [allBuckets, incomeData.totals, data.totals]);

  const formatBucket = (b) => {
    if (b === 'unscheduled') return 'Bez data';
    return period === 'week' ? ywLabel(b) : ymLabel(b);
  };

  return (
    <main style={styles.main}>
      <div style={styles.mainHeader}>
        <div>
          <h2 style={styles.projectTitle}>Cash Flow</h2>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>
            Plánované výdaje na položky projektů
            {expenseVatRate > 0 && (
              showWithVAT
                ? <span style={{ color: '#15803d', fontWeight: 600 }}> · výdaje s DPH {expenseVatRate}%</span>
                : <span style={{ color: '#64748b', fontWeight: 600 }}> · bez DPH</span>
            )}
            {!includeInvoiced && <span style={{ color: '#8b5cf6', fontWeight: 600 }}> · vyfakturované skryty</span>}
          </p>
        </div>
        <div style={styles.headerActions}>
          <button
            style={styles.primaryBtn}
            onClick={() => exportCashFlowToExcel(data, { groupBy, period, dateMode, formatBucket })}
            disabled={data.totalRows === 0}
            title="Stáhnout sestavu jako Excel"
          >
            <Download size={14} /> Export Excel
          </button>
        </div>
      </div>

      {/* Filtry */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', alignSelf: 'center' }}>SESKUPENÍ:</span>
        <button onClick={() => setGroupBy('category')} style={groupBy === 'category' ? styles.sortBtnActive : styles.sortBtn}>Kategorie</button>
        <button onClick={() => setGroupBy('project')} style={groupBy === 'project' ? styles.sortBtnActive : styles.sortBtn}>Projekt</button>
        <button onClick={() => setGroupBy('supplier')} style={groupBy === 'supplier' ? styles.sortBtnActive : styles.sortBtn}>Dodavatel</button>
        <span style={{ width: 1, background: '#e2e8f0', margin: '0 6px' }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', alignSelf: 'center' }}>PERIODA:</span>
        <button onClick={() => setPeriod('week')} style={period === 'week' ? styles.sortBtnActive : styles.sortBtn}>Týden</button>
        <button onClick={() => setPeriod('month')} style={period === 'month' ? styles.sortBtnActive : styles.sortBtn}>Měsíc</button>
        <span style={{ width: 1, background: '#e2e8f0', margin: '0 6px' }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', alignSelf: 'center' }}>DATUM:</span>
        <button onClick={() => setDateMode('due')} style={dateMode === 'due' ? styles.sortBtnActive : styles.sortBtn}>Splatnost</button>
        <button onClick={() => setDateMode('order')} style={dateMode === 'order' ? styles.sortBtnActive : styles.sortBtn}>Objednání</button>
        <span style={{ width: 1, background: '#e2e8f0', margin: '0 6px' }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', alignSelf: 'center' }}>VYFAKTUROVANÉ:</span>
        <button
          onClick={() => setIncludeInvoiced(!includeInvoiced)}
          style={includeInvoiced ? styles.sortBtnActive : styles.sortBtn}
          title={includeInvoiced
            ? 'Vyfakturované jsou zobrazené. Klikněte pro skrytí (typicky jsou už v saldu závazků).'
            : 'Vyfakturované jsou skryté (jsou v saldu závazků). Klikněte pro zobrazení.'}
        >
          {includeInvoiced ? '✓ Zahrnout' : 'Skrýt'}
        </button>
        {expenseVatRate > 0 && (
          <>
            <span style={{ width: 1, background: '#e2e8f0', margin: '0 6px' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', alignSelf: 'center' }}>DPH ({expenseVatRate}%):</span>
            <button
              onClick={() => setShowWithVAT(true)}
              style={showWithVAT ? styles.sortBtnActive : styles.sortBtn}
              title="Výdaje včetně DPH — realistická částka, která odejde z účtu"
            >
              S DPH
            </button>
            <button
              onClick={() => setShowWithVAT(false)}
              style={!showWithVAT ? styles.sortBtnActive : styles.sortBtn}
              title="Výdaje bez DPH — nákupní ceny dodavatelů"
            >
              Bez DPH
            </button>
          </>
        )}
      </div>

      {data.totalRows === 0 && incomeData.totalRows === 0 ? (
        <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8', border: '1px dashed #cbd5e1', borderRadius: 10, background: '#fff' }}>
          <Calendar size={36} style={{ opacity: 0.4, marginBottom: 12 }} />
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: '#475569' }}>Žádná data k zobrazení</div>
          <div style={{ fontSize: 13 }}>Přidejte projekty a položky (výdaje) nebo platby od klientů (příjmy) pro zobrazení cash flow.</div>
        </div>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, position: 'sticky', left: 0, background: '#f8fafc', minWidth: 200 }}>Skupina</th>
                {allBuckets.map(b => (
                  <th key={b} style={{ ...styles.th, textAlign: 'right', minWidth: 100 }}>{formatBucket(b)}</th>
                ))}
                <th style={{ ...styles.th, textAlign: 'right', fontWeight: 700 }}>Celkem</th>
              </tr>
            </thead>
            <tbody>
              {/* ======= VÝDAJE (červeně) ======= */}
              {data.groups.length > 0 && (
                <tr style={{ background: '#fef2f2' }}>
                  <td colSpan={allBuckets.length + 2} style={{ ...styles.td, fontSize: 11, fontWeight: 700, color: '#991b1b', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '6px 12px' }}>
                    ⬇ Výdaje (závazky vůči dodavatelům)
                  </td>
                </tr>
              )}
              {data.groups.map(g => {
                const rowTotal = Object.values(g.byBucket).reduce((s, v) => s + v, 0);
                return (
                  <tr key={g.key} style={styles.tr}>
                    <td style={{ ...styles.td, position: 'sticky', left: 0, background: '#fff', fontWeight: 500 }}>
                      <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: g.color, marginRight: 6, verticalAlign: 'middle' }} />
                      {g.label}
                      {g.sublabel && (
                        <span style={{ fontSize: 11, fontWeight: 400, color: '#94a3b8', marginLeft: 6 }}>· {g.sublabel}</span>
                      )}
                    </td>
                    {allBuckets.map(b => {
                      const v = g.byBucket[b];
                      if (!v) return <td key={b} style={{ ...styles.td, textAlign: 'right', color: '#cbd5e1' }}>—</td>;
                      return (
                        <td
                          key={b}
                          style={{
                            ...styles.td, textAlign: 'right', color: '#dc2626',
                            cursor: 'pointer',
                          }}
                          onClick={() => setBreakdownModal({
                            side: 'expense', title: `${g.label} · ${formatBucket(b)}`,
                            rows: data.rows.filter(r => r.groupKey === g.key && r.bucket === b),
                            total: v, showWithVAT, expenseVatRate,
                          })}
                          title="Klikněte pro detail plateb"
                        >
                          -{fmt(v)}
                        </td>
                      );
                    })}
                    <td
                      style={{
                        ...styles.td, textAlign: 'right', fontWeight: 700, color: '#dc2626',
                        cursor: 'pointer',
                      }}
                      onClick={() => setBreakdownModal({
                        side: 'expense', title: `${g.label} · celkem`,
                        rows: data.rows.filter(r => r.groupKey === g.key),
                        total: rowTotal, showWithVAT, expenseVatRate,
                      })}
                      title="Klikněte pro detail plateb"
                    >
                      -{fmt(rowTotal)}
                    </td>
                  </tr>
                );
              })}
              {/* Totals row - výdaje */}
              {data.groups.length > 0 && (
                <tr style={{ background: '#7f1d1d', color: '#fff' }}>
                  <td style={{ ...styles.td, position: 'sticky', left: 0, background: '#7f1d1d', color: '#fff', fontWeight: 700 }}>Celkem výdaje</td>
                  {allBuckets.map(b => (
                    <td key={b} style={{ ...styles.td, textAlign: 'right', color: '#fca5a5', fontWeight: 700 }}>
                      {data.totals[b] ? '-' + fmt(data.totals[b]) : '—'}
                    </td>
                  ))}
                  <td style={{ ...styles.td, textAlign: 'right', color: '#fff', fontWeight: 700 }}>
                    -{fmt(Object.values(data.totals).reduce((s, v) => s + v, 0))}
                  </td>
                </tr>
              )}

              {/* ======= PŘÍJMY (zeleně) ======= */}
              {incomeData.totalRows > 0 && (
                <>
                  <tr style={{ background: '#f0fdf4' }}>
                    <td colSpan={allBuckets.length + 2} style={{ ...styles.td, fontSize: 11, fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '6px 12px' }}>
                      ⬆ Příjmy (platby od klientů)
                    </td>
                  </tr>
                  {/* Per-projekt rows */}
                  {(() => {
                    // Seskupit příjmy podle projektu pro zobrazení
                    const byProject = new Map();
                    incomeData.rows.forEach(r => {
                      const k = r.projectId;
                      if (!byProject.has(k)) byProject.set(k, {
                        projectId: r.projectId,
                        projectName: r.projectName,
                        projectClient: r.projectClient || '',
                        byBucket: {},
                      });
                      const grp = byProject.get(k);
                      grp.byBucket[r.bucket] = (grp.byBucket[r.bucket] || 0) + r.amount;
                    });
                    return Array.from(byProject.values()).map(grp => {
                      const rowTotal = Object.values(grp.byBucket).reduce((s, v) => s + v, 0);
                      return (
                        <tr key={`income_${grp.projectId}`} style={styles.tr}>
                          <td style={{ ...styles.td, position: 'sticky', left: 0, background: '#fff', fontWeight: 500 }}>
                            <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: '#10b981', marginRight: 6, verticalAlign: 'middle' }} />
                            {grp.projectName}
                            {grp.projectClient && (
                              <span style={{ fontSize: 11, fontWeight: 400, color: '#94a3b8', marginLeft: 6 }}>· {grp.projectClient}</span>
                            )}
                          </td>
                          {allBuckets.map(b => {
                            const v = grp.byBucket[b];
                            if (!v) return <td key={b} style={{ ...styles.td, textAlign: 'right', color: '#cbd5e1' }}>—</td>;
                            return (
                              <td
                                key={b}
                                style={{
                                  ...styles.td, textAlign: 'right', color: '#10b981',
                                  cursor: 'pointer',
                                }}
                                onClick={() => setBreakdownModal({
                                  side: 'income', title: `${grp.projectName} · ${formatBucket(b)}`,
                                  rows: incomeData.rows.filter(r => r.projectId === grp.projectId && r.bucket === b),
                                  total: v, showWithVAT,
                                })}
                                title="Klikněte pro detail plateb"
                              >
                                +{fmt(v)}
                              </td>
                            );
                          })}
                          <td
                            style={{
                              ...styles.td, textAlign: 'right', fontWeight: 700, color: '#10b981',
                              cursor: 'pointer',
                            }}
                            onClick={() => setBreakdownModal({
                              side: 'income', title: `${grp.projectName} · celkem`,
                              rows: incomeData.rows.filter(r => r.projectId === grp.projectId),
                              total: rowTotal, showWithVAT,
                            })}
                            title="Klikněte pro detail plateb"
                          >
                            +{fmt(rowTotal)}
                          </td>
                        </tr>
                      );
                    });
                  })()}
                  {/* Totals row - příjmy */}
                  <tr style={{ background: '#15803d', color: '#fff' }}>
                    <td style={{ ...styles.td, position: 'sticky', left: 0, background: '#15803d', color: '#fff', fontWeight: 700 }}>Celkem příjmy</td>
                    {allBuckets.map(b => (
                      <td key={b} style={{ ...styles.td, textAlign: 'right', color: '#bbf7d0', fontWeight: 700 }}>
                        {incomeData.totals[b] ? '+' + fmt(incomeData.totals[b]) : '—'}
                      </td>
                    ))}
                    <td style={{ ...styles.td, textAlign: 'right', color: '#fff', fontWeight: 700 }}>
                      +{fmt(Object.values(incomeData.totals).reduce((s, v) => s + v, 0))}
                    </td>
                  </tr>
                </>
              )}

              {/* ======= SALDO ======= */}
              {(data.groups.length > 0 || incomeData.totalRows > 0) && (
                <tr style={{ background: '#0d3825', color: '#fff' }}>
                  <td style={{ ...styles.td, position: 'sticky', left: 0, background: '#0d3825', color: '#fff', fontWeight: 700 }}>SALDO (příjmy − výdaje)</td>
                  {allBuckets.map(b => {
                    const v = balance.perBucket[b] || 0;
                    return (
                      <td key={b} style={{ ...styles.td, textAlign: 'right', fontWeight: 700, color: v > 0 ? '#bbf7d0' : v < 0 ? '#fecaca' : '#cbd5e1' }}>
                        {v === 0 ? '—' : (v > 0 ? '+' : '') + fmt(v)}
                      </td>
                    );
                  })}
                  <td style={{ ...styles.td, textAlign: 'right', color: '#fff', fontWeight: 700 }}>
                    {(() => {
                      const total = Object.values(balance.perBucket).reduce((s, v) => s + v, 0);
                      return (total > 0 ? '+' : '') + fmt(total);
                    })()}
                  </td>
                </tr>
              )}

              {/* ======= KUMULATIVNĚ ======= */}
              <tr style={{ background: '#f8fafc' }}>
                <td style={{ ...styles.td, position: 'sticky', left: 0, background: '#f8fafc', fontStyle: 'italic', color: '#64748b', fontWeight: 600 }}>Kumulativně (saldo)</td>
                {allBuckets.map(b => {
                  const v = balance.cumulative[b];
                  if (v == null) return <td key={b} style={{ ...styles.td, textAlign: 'right', color: '#cbd5e1' }}>—</td>;
                  return (
                    <td key={b} style={{ ...styles.td, textAlign: 'right', fontStyle: 'italic', fontWeight: 600, color: v > 0 ? '#15803d' : v < 0 ? '#dc2626' : '#64748b' }}>
                      {(v > 0 ? '+' : '') + fmt(v)}
                    </td>
                  );
                })}
                <td style={{ ...styles.td }}></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {breakdownModal && (
        <CashFlowBreakdownModal
          {...breakdownModal}
          onClose={() => setBreakdownModal(null)}
        />
      )}
    </main>
  );
}

// ==========================================================================
// CashFlowBreakdownModal — detail plateb tvořících konkrétní částku
// ==========================================================================

function CashFlowBreakdownModal({ side, title, rows, total, showWithVAT, expenseVatRate, onClose }) {
  const isExpense = side === 'expense';
  // Seřadit podle splatnosti
  const sorted = [...rows].sort((a, b) => {
    const da = isExpense ? (a.item?.paymentDueDate || a.bucket) : (a.payment?.dueDate || '');
    const db = isExpense ? (b.item?.paymentDueDate || b.bucket) : (b.payment?.dueDate || '');
    return (da || '').localeCompare(db || '');
  });

  return (
    <Modal title={`Detail plateb · ${title}`} onClose={onClose} maxWidth={720}>
      <div style={{
        marginBottom: 12, padding: 10, borderRadius: 6,
        background: isExpense ? '#fef2f2' : '#f0fdf4',
        border: `1px solid ${isExpense ? '#fecaca' : '#bbf7d0'}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontSize: 13, color: isExpense ? '#991b1b' : '#166534' }}>
          {sorted.length} {sorted.length === 1 ? 'platba' : sorted.length < 5 ? 'platby' : 'plateb'}
          {isExpense && expenseVatRate > 0 && (
            <span style={{ marginLeft: 8, fontSize: 11 }}>
              ({showWithVAT ? `s DPH ${expenseVatRate} %` : 'bez DPH'})
            </span>
          )}
          {!isExpense && (
            <span style={{ marginLeft: 8, fontSize: 11 }}>
              ({showWithVAT ? 's DPH' : 'bez DPH'})
            </span>
          )}
        </span>
        <span style={{ fontSize: 16, fontWeight: 700, color: isExpense ? '#dc2626' : '#10b981' }}>
          {isExpense ? '-' : '+'}{fmt(total)}
        </span>
      </div>

      <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, overflow: 'auto', maxHeight: 460 }}>
        <table style={{ ...styles.table, fontSize: 12 }}>
          <thead>
            <tr>
              {isExpense ? (
                <>
                  <th style={styles.th}>Položka</th>
                  <th style={styles.th}>Projekt</th>
                  <th style={styles.th}>Tranše</th>
                  <th style={styles.th}>Splatnost</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Částka</th>
                </>
              ) : (
                <>
                  <th style={styles.th}>Popis splátky</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Splatnost</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Částka</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, i) => isExpense ? (
              <tr key={i} style={{ ...styles.tr, background: r.overdue ? '#fef2f2' : 'transparent' }}>
                <td style={styles.td}>
                  <div style={{ fontWeight: 500 }}>{r.item?.name || '—'}</div>
                  {r.item?.notes && <div style={{ fontSize: 10, color: '#94a3b8' }}>{r.item.notes}</div>}
                </td>
                <td style={{ ...styles.td, fontSize: 11, color: '#64748b' }}>{r.projectName}</td>
                <td style={{ ...styles.td, fontSize: 11 }}>
                  <span style={{
                    padding: '1px 6px', borderRadius: 3, fontSize: 10, fontWeight: 600,
                    background: '#e0e7ff', color: '#3730a3',
                  }}>{r.tranche || 'celkem'}</span>
                </td>
                <td style={{ ...styles.td, fontSize: 11 }}>
                  {r.item?.paymentDueDate || <span style={{ color: '#cbd5e1' }}>—</span>}
                  {r.overdue && <div style={{ fontSize: 9, color: '#dc2626', fontWeight: 600 }}>PO SPLATNOSTI</div>}
                </td>
                <td style={{ ...styles.td, textAlign: 'right', fontWeight: 600, color: '#dc2626' }}>
                  -{fmt(r.amount)}
                  {showWithVAT && expenseVatRate > 0 && r.amountNet != null && (
                    <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 400 }}>
                      bez DPH: {fmt(r.amountNet)}
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              <tr key={i} style={{ ...styles.tr, background: r.overdue ? '#fef2f2' : 'transparent' }}>
                <td style={styles.td}>
                  <div style={{ fontWeight: 500 }}>{r.payment?.label || '(bez popisu)'}</div>
                  {r.payment?.notes && <div style={{ fontSize: 10, color: '#94a3b8' }}>{r.payment.notes}</div>}
                </td>
                <td style={{ ...styles.td, fontSize: 11 }}>
                  {(() => {
                    const st = CLIENT_PAYMENT_STATUSES.find(s => s.id === (r.payment?.status || 'planned'));
                    return (
                      <span style={{
                        padding: '1px 6px', borderRadius: 3, fontSize: 10, fontWeight: 600,
                        background: st?.bg, color: st?.color,
                      }}>{st?.label}</span>
                    );
                  })()}
                </td>
                <td style={{ ...styles.td, fontSize: 11 }}>
                  {r.payment?.dueDate || <span style={{ color: '#cbd5e1' }}>—</span>}
                  {r.overdue && <div style={{ fontSize: 9, color: '#dc2626', fontWeight: 600 }}>PO SPLATNOSTI</div>}
                </td>
                <td style={{ ...styles.td, textAlign: 'right', fontWeight: 600, color: '#10b981' }}>
                  +{fmt(r.amount)}
                  {showWithVAT && r.projectVatRate > 0 && (
                    <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 400 }}>
                      bez DPH: {fmt(r.amountGross / (1 + r.projectVatRate / 100))}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.modalActions}>
        <button style={styles.primaryBtn} onClick={onClose}>Zavřít</button>
      </div>
    </Modal>
  );
}

// ==========================================================================
// Export Cash Flow do Excelu (.xlsx)
// ==========================================================================

async function exportCashFlowToExcel(data, opts) {
  if (!data || data.totalRows === 0) {
    alert('Žádná data k exportu.');
    return;
  }
  try {
    const XLSX = await loadXLSX();
    const { groupBy, period, dateMode, formatBucket } = opts;

    const groupByLabel = { category: 'Kategorie', project: 'Projekt', supplier: 'Dodavatel' }[groupBy] || 'Skupina';
    const periodLabel = period === 'week' ? 'týdně' : 'měsíčně';
    const dateModeLabel = { due: 'splatnost', order: 'datum objednání', planned: 'plánované objednání' }[dateMode] || dateMode;

    // ===== Tabulka jako 2D array =====
    const today = new Date().toLocaleDateString('cs-CZ');
    const rows = [];

    // Hlavička sestavy
    rows.push([`Cash Flow sestava — Electree Solar`]);
    rows.push([`Vygenerováno: ${today}`]);
    rows.push([`Seskupení: ${groupByLabel} · Perioda: ${periodLabel} · Datum: ${dateModeLabel}`]);
    rows.push([]); // prázdný řádek

    // Hlavička tabulky
    const header = [groupByLabel, ...data.buckets.map(b => formatBucket(b)), 'Celkem'];
    rows.push(header);

    // Datové řádky
    data.groups.forEach(g => {
      const rowTotal = Object.values(g.byBucket).reduce((s, v) => s + v, 0);
      const row = [g.label];
      data.buckets.forEach(b => {
        row.push(g.byBucket[b] || 0);
      });
      row.push(rowTotal);
      rows.push(row);
    });

    // Součty
    const totalsRow = ['CELKEM'];
    let grandTotal = 0;
    data.buckets.forEach(b => {
      totalsRow.push(data.totals[b] || 0);
      grandTotal += data.totals[b] || 0;
    });
    totalsRow.push(grandTotal);
    rows.push(totalsRow);

    // Kumulativně
    if (data.cumulative) {
      const cumRow = ['Kumulativně'];
      data.buckets.forEach(b => {
        cumRow.push(data.cumulative[b] != null ? data.cumulative[b] : '');
      });
      cumRow.push('');
      rows.push(cumRow);
    }

    // ===== Vytvořit worksheet =====
    const ws = XLSX.utils.aoa_to_sheet(rows);

    // Šířky sloupců
    const colWidths = [{ wch: 30 }];
    data.buckets.forEach(() => colWidths.push({ wch: 14 }));
    colWidths.push({ wch: 16 }); // Celkem
    ws['!cols'] = colWidths;

    // Sloučit první 3 řádky (hlavičky sestavy) přes všechny sloupce
    const totalCols = data.buckets.length + 2;
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: totalCols - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: totalCols - 1 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: totalCols - 1 } },
    ];

    // Číselný formát pro datové buňky (Kč s mezerou jako tisícoddělovač)
    const numberFormat = '#,##0\\ "Kč";\\-#,##0\\ "Kč";"—"';
    const headerRowIdx = 4; // 0-based: po 3 řádcích hlavičky + 1 prázdný
    const dataStartRow = headerRowIdx + 1;
    const dataEndRow = dataStartRow + data.groups.length - 1;
    const totalsRowIdx = dataEndRow + 1;
    const cumRowIdx = data.cumulative ? totalsRowIdx + 1 : null;

    // Aplikovat formátování na všechny buňky s čísly (od sloupce 1 do konce)
    for (let r = dataStartRow; r <= (cumRowIdx || totalsRowIdx); r++) {
      for (let c = 1; c < totalCols; c++) {
        const cellRef = XLSX.utils.encode_cell({ r, c });
        if (ws[cellRef] && typeof ws[cellRef].v === 'number') {
          ws[cellRef].z = numberFormat;
          ws[cellRef].t = 'n';
        }
      }
    }

    // Styling — pomocí celleního atributu 's' (jen pokud SheetJS Pro je dostupné; jinak ignorováno).
    // Pro CE Community Edition použijeme alespoň tučné hlavičky přes !rows výšky.
    ws['!rows'] = [];
    ws['!rows'][0] = { hpt: 22 }; // Title
    ws['!rows'][4] = { hpt: 22 }; // Table header
    ws['!rows'][totalsRowIdx] = { hpt: 20 };

    // ===== Vytvořit workbook =====
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Cash Flow');

    // Druhý list: detailní seznam položek (jeden řádek = jedna platba)
    const detailRows = [];
    detailRows.push([
      'Skupina', 'Bucket', 'Projekt', 'Položka', 'Tranše', 'Splatnost',
      'Částka (Kč)', 'Po splatnosti'
    ]);
    // ZNOVU iterujeme zdrojová data — bohužel je nemáme k dispozici (data.groups je již agregované).
    // Detail list vynecháme, pokud nemáme přístup k surovým řádkům.
    // → Alternativa: jen seskupený přehled stačí.

    // ===== Stáhnout =====
    const filename = `cashflow_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, filename);
  } catch (e) {
    console.error(e);
    alert('Chyba při exportu: ' + (e?.message || 'neznámá chyba'));
  }
}

// ==========================================================================
// Modals
// ==========================================================================


function Modal({ title, children, onClose, maxWidth = 540 }) {
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={{ ...styles.modal, maxWidth }} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>{title}</h3>
          <button style={styles.iconBtn} onClick={onClose}><X size={18} /></button>
        </div>
        <div style={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
}

// Aplikovatelné sazby DPH v ČR pro FVE projekty
const VAT_RATES = [
  { id: 0,  label: '0 % — přenesená daňová povinnost (B2B FVE)', short: '0 %' },
  { id: 12, label: '12 % — soukromé osoby (rodinné domy)',        short: '12 %' },
  { id: 21, label: '21 % — firmy (standardní sazba)',             short: '21 %' },
];

function ProjectModal({ project, onSave, onClose }) {
  const [name, setName] = useState(project?.name || '');
  const [client, setClient] = useState(project?.client || '');
  const [power, setPower] = useState(project?.power || '');
  const [contractValue, setContractValue] = useState(project?.contractValue ?? '');
  const [vatRate, setVatRate] = useState(project?.vatRate ?? 21);

  const net = parseFloat(contractValue) || 0;
  const gross = net * (1 + vatRate / 100);

  const submit = () => {
    if (!name.trim()) { alert('Zadejte název projektu'); return; }
    onSave({
      name: name.trim(),
      client: client.trim(),
      power,
      contractValue: net,
      vatRate: parseFloat(vatRate) || 0,
    });
  };

  return (
    <Modal title={project ? 'Upravit projekt' : 'Nový projekt'} onClose={onClose} maxWidth={580}>
      <div style={styles.formRow}>
        <label style={styles.label}>Název projektu *</label>
        <input autoFocus style={styles.input} value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div style={styles.formRow}>
        <label style={styles.label}>Klient</label>
        <input style={styles.input} value={client} onChange={e => setClient(e.target.value)} />
      </div>
      <div style={styles.formRow}>
        <label style={styles.label}>Instalovaný výkon (kWp)</label>
        <input type="number" step="0.1" style={styles.input} value={power} onChange={e => setPower(e.target.value)} />
      </div>

      {/* Hodnota smlouvy + DPH */}
      <div style={{ marginTop: 12, padding: 12, background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#166534', marginBottom: 8 }}>
          💰 Hodnota smlouvy s klientem
        </div>
        <div style={styles.formRowGroup}>
          <div style={{ flex: 2 }}>
            <label style={styles.label}>Hodnota smlouvy bez DPH (CZK)</label>
            <input
              type="number" step="0.01" min="0"
              style={styles.input}
              value={contractValue}
              onChange={e => setContractValue(e.target.value)}
              placeholder="např. 450000"
            />
          </div>
          <div style={{ flex: 2 }}>
            <label style={styles.label}>Sazba DPH</label>
            <select style={styles.input} value={vatRate} onChange={e => setVatRate(parseFloat(e.target.value))}>
              {VAT_RATES.map(v => (
                <option key={v.id} value={v.id}>{v.label}</option>
              ))}
            </select>
          </div>
        </div>
        {net > 0 && (
          <div style={{ marginTop: 8, padding: 8, background: '#fff', borderRadius: 6, border: '1px solid #bbf7d0', fontSize: 12, color: '#0d3825' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Hodnota bez DPH:</span>
              <strong>{fmt(net)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
              <span>DPH ({vatRate} %):</span>
              <strong>{fmt(gross - net)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, paddingTop: 4, borderTop: '1px solid #bbf7d0', fontSize: 13 }}>
              <span><strong>Klient zaplatí (s DPH):</strong></span>
              <strong style={{ color: '#15803d' }}>{fmt(gross)}</strong>
            </div>
          </div>
        )}
        <div style={{ fontSize: 11, color: '#166534', marginTop: 6 }}>
          Tato hodnota se použije pro platební plán a cash flow (příjmy).
        </div>
      </div>

      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 10, marginBottom: 8 }}>
        EUR → CZK kurz nastavíte v <strong>Nastavení</strong>.
      </div>
      <div style={styles.modalActions}>
        <button style={styles.secondaryBtn} onClick={onClose}>Zrušit</button>
        <button style={styles.primaryBtn} onClick={submit}>{project ? 'Uložit změny' : 'Vytvořit projekt'}</button>
      </div>
    </Modal>
  );
}

// Settings Modal — tabs: FX rate, Categories, Users
// ==========================================================================

function SettingsModal({ settings, categories, locations, paymentPlanTemplates, role, fullData, initialTab, onSaveSettings, onSaveCategories, onSaveLocations, onSavePaymentPlanTemplates, onDeletePdfAttachment, onRestoreData, onClose }) {
  const userRole = role || 'admin';
  const allowedTabs = ROLE_SETTINGS_TABS[userRole] || ROLE_SETTINGS_TABS.editor;
  const [tab, setTab] = useState(() => {
    // Pokud je zadaný initialTab a je povolený, otevřít ho; jinak první povolený
    if (initialTab && allowedTabs.includes(initialTab)) return initialTab;
    return allowedTabs[0] || 'fx';
  });

  // Pokud aktuální tab není povolený, přepnout na první povolený
  useEffect(() => {
    if (!allowedTabs.includes(tab)) {
      setTab(allowedTabs[0] || 'fx');
    }
  }, [tab, allowedTabs]);

  return (
    <Modal title="Nastavení" onClose={onClose} maxWidth={780}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: '1px solid #e2e8f0', paddingBottom: 0, flexWrap: 'wrap' }}>
        {allowedTabs.includes('fx') && (
          <SettingsTab active={tab === 'fx'} onClick={() => setTab('fx')} icon={<TrendingUp size={13} />}>Ostatní</SettingsTab>
        )}
        {allowedTabs.includes('categories') && (
          <SettingsTab active={tab === 'categories'} onClick={() => setTab('categories')} icon={<Package size={13} />}>Kategorie</SettingsTab>
        )}
        {allowedTabs.includes('locations') && (
          <SettingsTab active={tab === 'locations'} onClick={() => setTab('locations')} icon={<MapPin size={13} />}>Skladové lokace</SettingsTab>
        )}
        {allowedTabs.includes('paymentPlans') && (
          <SettingsTab active={tab === 'paymentPlans'} onClick={() => setTab('paymentPlans')} icon={<FileText size={13} />}>Platební plány</SettingsTab>
        )}
        {allowedTabs.includes('pdfArchive') && (
          <SettingsTab active={tab === 'pdfArchive'} onClick={() => setTab('pdfArchive')} icon={<FileText size={13} />}>PDF archiv</SettingsTab>
        )}
        {allowedTabs.includes('backup') && (
          <SettingsTab active={tab === 'backup'} onClick={() => setTab('backup')} icon={<Download size={13} />}>Zálohování</SettingsTab>
        )}
      </div>

      {tab === 'fx' && allowedTabs.includes('fx') && <FxSettingsTab settings={settings} onSave={onSaveSettings} onClose={onClose} readOnly={userRole === 'management'} />}
      {tab === 'categories' && allowedTabs.includes('categories') && <CategoriesSettingsTab categories={categories} onSave={onSaveCategories} onClose={onClose} readOnly={userRole === 'management'} />}
      {tab === 'locations' && allowedTabs.includes('locations') && <LocationsSettingsTab locations={locations} stockItems={fullData.stockItems} onSave={onSaveLocations} onClose={onClose} readOnly={userRole === 'management'} />}
      {tab === 'paymentPlans' && allowedTabs.includes('paymentPlans') && <PaymentPlansSettingsTab templates={paymentPlanTemplates || []} onSave={onSavePaymentPlanTemplates} readOnly={userRole === 'management'} />}
      {tab === 'pdfArchive' && allowedTabs.includes('pdfArchive') && <PdfArchiveSettingsTab attachments={fullData.pdfAttachments || []} projects={fullData.projects} onDelete={onDeletePdfAttachment} readOnly={userRole === 'management'} />}
      {tab === 'backup' && allowedTabs.includes('backup') && <BackupSettingsTab fullData={fullData} onRestoreData={onRestoreData} onClose={onClose} />}
    </Modal>
  );
}

function SettingsTab({ active, onClick, icon, children }) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '10px 16px', fontSize: 13, fontWeight: active ? 700 : 500,
      color: active ? '#0d3825' : '#64748b',
      background: 'transparent',
      border: 'none',
      borderBottom: active ? '2px solid #0d3825' : '2px solid transparent',
      cursor: 'pointer', fontFamily: 'inherit',
      marginBottom: -1,
    }}>
      {icon} {children}
    </button>
  );
}

// --- FX rate tab ---
function FxSettingsTab({ settings, onSave, onClose, readOnly }) {
  const [fxRate, setFxRate] = useState(settings?.fxRate ?? 25);
  const [expenseVatRate, setExpenseVatRate] = useState(settings?.expenseVatRate ?? 21);
  const [anthropicApiKey, setAnthropicApiKey] = useState(settings?.anthropicApiKey ?? '');
  const [anthropicModel, setAnthropicModel] = useState(settings?.anthropicModel ?? 'claude-sonnet-4-5');
  const [showApiKey, setShowApiKey] = useState(false);

  const submit = () => {
    if (readOnly) return;
    const parsedFx = parseFloat(fxRate);
    const parsedVat = parseFloat(expenseVatRate);
    if (!parsedFx || parsedFx <= 0) return;
    onSave({
      fxRate: parsedFx,
      expenseVatRate: isNaN(parsedVat) ? 0 : parsedVat,
      anthropicApiKey: anthropicApiKey.trim(),
      anthropicModel: anthropicModel.trim() || 'claude-sonnet-4-5',
    });
  };
  return (
    <>
      {readOnly && <ReadOnlyBanner />}
      <div style={styles.formRow}>
        <label style={styles.label}>Směnný kurz EUR → CZK *</label>
        <input type="number" step="0.01" min="0" style={styles.input}
          value={fxRate} onChange={e => setFxRate(e.target.value)} autoFocus={!readOnly} disabled={readOnly} />
        <div style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>
          Tento kurz se globálně použije na každou položku, fakturu dodavatele a smlouvu se zákazníkem v EUR. Jeho změna okamžitě přepočítá všechny EUR částky napříč všemi projekty.
        </div>
      </div>
      <div style={{ ...styles.totalPreview, borderLeftColor: '#3b82f6', marginTop: 12 }}>
        <div style={{ fontSize: 12, color: '#475569' }}>
          Příklad: €1 000 → <strong>{fmt((parseFloat(fxRate) || 0) * 1000)}</strong>
        </div>
      </div>

      <div style={{ marginTop: 18, padding: 12, background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#166534', marginBottom: 8 }}>
          🧾 DPH na nákupy (výdaje v cash flow)
        </div>
        <div style={styles.formRow}>
          <label style={styles.label}>Sazba DPH pro výdaje (%)</label>
          <input type="number" step="0.1" min="0" max="100" style={styles.input}
            value={expenseVatRate} onChange={e => setExpenseVatRate(e.target.value)} disabled={readOnly} />
          <div style={{ fontSize: 12, color: '#166534', marginTop: 6 }}>
            Ceny položek zadáváte bez DPH (nákupní ceny). V cash flow se výdaje zobrazí <strong>včetně DPH</strong> — protože tolik reálně odejde z účtu. Standardně 21 % v ČR. Pokud má váš dodavatel přenesenou daňovou povinnost, zadejte 0.
          </div>
        </div>
        <div style={{ ...styles.totalPreview, borderLeftColor: '#10b981', marginTop: 6, background: '#fff' }}>
          <div style={{ fontSize: 12, color: '#475569' }}>
            Příklad: položka za 100 000 Kč bez DPH → <strong style={{ color: '#15803d' }}>{fmt(100000 * (1 + (parseFloat(expenseVatRate) || 0) / 100))}</strong> v cash flow (s DPH {parseFloat(expenseVatRate) || 0} %)
          </div>
        </div>
      </div>

      <div style={{ marginTop: 18, padding: 12, background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#92400e', marginBottom: 8 }}>
          🤖 Import PDF faktur / objednávek přes AI
        </div>
        <div style={{ fontSize: 12, color: '#78350f', marginBottom: 10 }}>
          Zadejte klíč k Anthropic API pro automatickou extrakci položek z PDF dokumentů. Klíč získáte v <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer" style={{ color: '#78350f', fontWeight: 600 }}>console.anthropic.com</a>. Klíč se ukládá jen ve vašem prohlížeči.
        </div>
        <div style={styles.formRow}>
          <label style={styles.label}>Anthropic API klíč</label>
          <div style={{ display: 'flex', gap: 6 }}>
            <input
              type={showApiKey ? 'text' : 'password'}
              style={{ ...styles.input, flex: 1 }}
              value={anthropicApiKey}
              onChange={e => setAnthropicApiKey(e.target.value)}
              placeholder="sk-ant-api03-..."
              disabled={readOnly}
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              style={styles.sortBtn}
              title={showApiKey ? 'Skrýt klíč' : 'Zobrazit klíč'}
            >
              <Eye size={12} />
            </button>
          </div>
        </div>
        <div style={styles.formRow}>
          <label style={styles.label}>Model</label>
          <select
            style={styles.input}
            value={anthropicModel}
            onChange={e => setAnthropicModel(e.target.value)}
            disabled={readOnly}
          >
            <option value="claude-sonnet-4-5">Claude Sonnet 4.5 (doporučeno · nejvyšší přesnost)</option>
            <option value="claude-haiku-4-5">Claude Haiku 4.5 (rychlé · levné · lehce nižší přesnost)</option>
            <option value="claude-opus-4-5">Claude Opus 4.5 (nejnáročnější dokumenty · dražší)</option>
          </select>
          <div style={{ fontSize: 11, color: '#78350f', marginTop: 4 }}>
            Náklady: Sonnet ~0.01–0.03 $ za fakturu · Haiku ~0.002–0.005 $ · Opus ~0.05–0.15 $
          </div>
        </div>
        <div style={{ fontSize: 11, color: '#78350f', marginTop: 8, padding: 8, background: '#fff', borderRadius: 6, border: '1px solid #fcd34d' }}>
          ⚠ <strong>Bezpečnost:</strong> API klíč se ukládá v <code>localStorage</code> prohlížeče. Nesdílejte veřejný počítač s někým, komu nedůvěřujete. Doporučujeme klíč omezit spend limitem v Anthropic Console.
        </div>
      </div>

      <div style={styles.modalActions}>
        <button style={styles.secondaryBtn} onClick={onClose}>{readOnly ? 'Zavřít' : 'Zrušit'}</button>
        {!readOnly && (
          <button style={styles.primaryBtn} onClick={submit} disabled={!fxRate || parseFloat(fxRate) <= 0}>Uložit</button>
        )}
      </div>
    </>
  );
}

function ReadOnlyBanner() {
  return (
    <div style={{
      padding: 10, marginBottom: 14, borderRadius: 6,
      background: '#dbeafe', border: '1px solid #bfdbfe', color: '#1d4ed8',
      fontSize: 12, display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <Eye size={14} style={{ flexShrink: 0 }} /> <strong>Pouze pro čtení</strong> — vaše role nemá oprávnění k úpravám.
    </div>
  );
}
function CategoriesSettingsTab({ categories, onSave, onClose, readOnly }) {
  const [list, setList] = useState(categories);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const addCat = (kind) => { if (readOnly) return; setList([...list, { id: uid('cat'), name: 'Nová kategorie', color: PALETTE[list.length % PALETTE.length], kind }]); };
  const update = (id, patch) => { if (readOnly) return; setList(list.map(c => c.id === id ? { ...c, ...patch } : c)); };
  const remove = (id) => { if (readOnly) return; setList(list.filter(c => c.id !== id)); setConfirmDeleteId(null); };
  const groups = [
    { kind: 'material', label: 'Materiál', icon: <Package size={14} /> },
    { kind: 'labor', label: 'Práce a subdodavatelé', icon: <Wrench size={14} /> },
    { kind: 'commission', label: 'Provize a řízení', icon: <Briefcase size={14} /> },
  ];
  return (
    <>
      {readOnly && <ReadOnlyBanner />}
      <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 12px' }}>
        Kategorie se používají v položkách, rozpočtech a cash flow reportech.
      </p>
      {groups.map(g => (
        <div key={g.kind} style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={styles.groupLabel}>{g.icon} {g.label}</div>
            {!readOnly && (
              <button style={styles.sortBtn} onClick={() => addCat(g.kind)}><Plus size={12} /> Přidat</button>
            )}
          </div>
          {list.filter(c => c.kind === g.kind).map(cat => (
            <div key={cat.id} style={styles.catRow}>
              <input type="color" value={cat.color} onChange={e => update(cat.id, { color: e.target.value })} style={styles.colorInput} disabled={readOnly} />
              <input style={{ ...styles.input, flex: 1 }} value={cat.name} onChange={e => update(cat.id, { name: e.target.value })} disabled={readOnly} />
              <select style={{ ...styles.input, width: 140 }} value={cat.kind} onChange={e => update(cat.id, { kind: e.target.value })} disabled={readOnly}>
                <option value="material">Materiál</option>
                <option value="labor">Práce</option>
                <option value="commission">Provize</option>
              </select>
              {!readOnly && (
                confirmDeleteId === cat.id ? (
                  <div style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: '#dc2626', fontWeight: 600 }}>Opravdu?</span>
                    <button
                      onClick={() => remove(cat.id)}
                      style={{ ...styles.iconBtn, color: '#dc2626', background: '#fee2e2', border: '1px solid #fca5a5' }}
                      title="Potvrdit smazání"
                    ><Trash2 size={14} /></button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      style={{ ...styles.iconBtn, color: '#64748b' }}
                      title="Zrušit"
                    ><X size={14} /></button>
                  </div>
                ) : (
                  <button style={styles.iconBtn} onClick={() => setConfirmDeleteId(cat.id)}><Trash2 size={14} /></button>
                )
              )}
            </div>
          ))}
        </div>
      ))}
      <div style={styles.modalActions}>
        <button style={styles.secondaryBtn} onClick={onClose}>{readOnly ? 'Zavřít' : 'Zrušit'}</button>
        {!readOnly && (
          <button style={styles.primaryBtn} onClick={() => onSave(list.filter(c => c.name.trim()))}>Uložit</button>
        )}
      </div>
    </>
  );
}
// ==========================================================================
// Locations Settings Tab — správa skladových lokací
// ==========================================================================

// SELF-CONTAINED ROW: každý řádek si drží vlastní state pro name/phone/notes.
// Parent LocationsSettingsTab dělá jen add/remove — nikdy nezmění existující data
// řádku. Tím je LocationRow imunní proti re-renderům parenta (React.memo).
const LocationRow = React.memo(function LocationRow({
  initialData, type, inUse, isProtected, readOnly, onRemove, onDataChange,
}) {
  const [name, setName] = useState(initialData.name || '');
  const [phone, setPhone] = useState(initialData.phone || '');
  const [notes, setNotes] = useState(initialData.notes || '');
  const [confirmDel, setConfirmDel] = useState(false);

  // Uložit změny do parenta (pomocí ref-based callbacku, nemá vliv na re-render)
  useEffect(() => { onDataChange(initialData.id, { name, phone, notes, type }); }, [name, phone, notes]);

  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
      <input
        style={{ ...styles.input, flex: 1 }}
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Název"
        disabled={readOnly}
      />
      {type === 'person' && (
        <input
          style={{ ...styles.input, width: 160 }}
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="Telefon"
          disabled={readOnly}
        />
      )}
      <input
        style={{ ...styles.input, flex: 1 }}
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Poznámka"
        disabled={readOnly}
      />
      {inUse > 0 && (
        <span style={{ fontSize: 11, color: '#64748b', whiteSpace: 'nowrap' }}>{inUse} kusů</span>
      )}
      {!readOnly && !isProtected && (
        confirmDel ? (
          <div style={{ display: 'inline-flex', gap: 4 }}>
            <button onClick={() => onRemove(initialData.id)}
              style={{ ...styles.iconBtn, color: '#dc2626', background: '#fee2e2', border: '1px solid #fca5a5' }}
              title="Potvrdit"><Trash2 size={14} /></button>
            <button onClick={() => setConfirmDel(false)}
              style={{ ...styles.iconBtn, color: '#64748b' }}
              title="Zrušit"><X size={14} /></button>
          </div>
        ) : (
          <button
            style={{ ...styles.iconBtn, opacity: inUse > 0 ? 0.4 : 1 }}
            disabled={inUse > 0}
            title={inUse > 0 ? 'Nelze smazat — na lokaci jsou kusy' : 'Smazat'}
            onClick={() => setConfirmDel(true)}
          ><Trash2 size={14} /></button>
        )
      )}
    </div>
  );
}, (prev, next) => {
  // Přerenderovat jen když se opravdu mění strukturální props.
  // initialData je stabilní (nikdy se neupdatuje ze zvenčí).
  return prev.initialData === next.initialData
    && prev.type === next.type
    && prev.inUse === next.inUse
    && prev.isProtected === next.isProtected
    && prev.readOnly === next.readOnly;
});

function LocationsSettingsTab({ locations, stockItems, onSave, onClose, readOnly }) {
  // Systémová lokace "Na cestě" se v Nastavení nezobrazuje — je automatická.
  // Při ukládání ji zase přidáme zpět.
  const editableLocations = useMemo(() => locations.filter(l => l.type !== 'transit'), [locations]);
  const transitLoc = useMemo(() => locations.find(l => l.type === 'transit'), [locations]);

  // Struktura: pole { id, type, initialData } — initialData je STABILNÍ reference
  // po dobu života řádku (dokud řádek existuje). React.memo pak nikdy nepřerendruje řádek.
  const [rows, setRows] = useState(() =>
    editableLocations.map(l => ({
      id: l.id,
      type: l.type,
      initialData: { id: l.id, name: l.name || '', phone: l.phone || '', notes: l.notes || '' },
    }))
  );

  // Aktuální hodnoty všech řádků (drženo v ref, nikoli state — nezpůsobuje re-render)
  const currentValuesRef = useRef({});
  useEffect(() => {
    // Inicializace pro existující řádky
    editableLocations.forEach(l => {
      if (!currentValuesRef.current[l.id]) {
        currentValuesRef.current[l.id] = { name: l.name || '', phone: l.phone || '', notes: l.notes || '', type: l.type };
      }
    });
  }, []); // jen jednou

  const handleDataChange = useCallback((id, data) => {
    currentValuesRef.current[id] = { ...currentValuesRef.current[id], ...data };
  }, []);

  const usedLocations = useMemo(() => {
    const counts = {};
    (stockItems || []).forEach(s => { counts[s.locationId] = (counts[s.locationId] || 0) + 1; });
    return counts;
  }, [stockItems]);

  const addLocation = (type) => {
    if (readOnly) return;
    const id = uid('loc');
    const defaultName = type === 'warehouse' ? 'Nový sklad' : 'Nový elektrikář';
    currentValuesRef.current[id] = { name: defaultName, phone: '', notes: '', type };
    setRows(prev => [...prev, {
      id, type,
      initialData: { id, name: defaultName, phone: '', notes: '' },
    }]);
  };

  const removeRow = useCallback((id) => {
    delete currentValuesRef.current[id];
    setRows(prev => prev.filter(r => r.id !== id));
  }, []);

  const handleSave = () => {
    const cleaned = rows
      .map(r => {
        const v = currentValuesRef.current[r.id] || {};
        return {
          id: r.id,
          type: r.type,
          name: (v.name || '').trim(),
          phone: (v.phone || '').trim(),
          notes: (v.notes || '').trim(),
        };
      })
      .filter(l => l.name);
    if (!cleaned.some(l => l.id === 'loc_warehouse')) {
      cleaned.unshift({ id: 'loc_warehouse', name: 'Hlavní sklad', type: 'warehouse', notes: '' });
    }
    // Zachovat systémovou lokaci "Na cestě"
    if (transitLoc && !cleaned.some(l => l.id === TRANSIT_LOCATION_ID)) {
      cleaned.push(transitLoc);
    }
    onSave(cleaned);
  };

  const warehouses = rows.filter(r => r.type === 'warehouse');
  const electricians = rows.filter(r => r.type === 'person');

  const renderSection = (title, icon, items, type) => (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={styles.groupLabel}>{icon} {title}</div>
        {!readOnly && (
          <button style={styles.sortBtn} onClick={() => addLocation(type)}><Plus size={12} /> Přidat</button>
        )}
      </div>
      {items.length === 0 ? (
        <div style={{ padding: 12, color: '#94a3b8', fontSize: 12, fontStyle: 'italic' }}>Žádné záznamy</div>
      ) : items.map(r => (
        <LocationRow
          key={r.id}
          initialData={r.initialData}
          type={r.type}
          inUse={usedLocations[r.id] || 0}
          isProtected={r.id === 'loc_warehouse'}
          readOnly={readOnly}
          onRemove={removeRow}
          onDataChange={handleDataChange}
        />
      ))}
    </div>
  );

  return (
    <>
      {readOnly && <ReadOnlyBanner />}
      <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 14px' }}>
        Lokace určují, kde se aktuálně nachází jednotlivé skladové kusy. „Hlavní sklad" nelze smazat.
      </p>
      {renderSection('Sklady', <Warehouse size={14} />, warehouses, 'warehouse')}
      {renderSection('Elektrikáři', <UserIcon size={14} />, electricians, 'person')}
      <div style={styles.modalActions}>
        <button style={styles.secondaryBtn} onClick={onClose}>{readOnly ? 'Zavřít' : 'Zrušit'}</button>
        {!readOnly && (
          <button style={styles.primaryBtn} onClick={handleSave}>Uložit</button>
        )}
      </div>
    </>
  );
}


// ==========================================================================
// PaymentPlansSettingsTab — správa šablon platebních plánů
// ==========================================================================

function PaymentPlansSettingsTab({ templates, onSave, readOnly }) {
  const [editing, setEditing] = useState(null); // { template } - null=closed, {}=new
  const [confirmDel, setConfirmDel] = useState(null);

  const removeTemplate = (id) => {
    onSave(templates.filter(t => t.id !== id));
    setConfirmDel(null);
  };

  const saveTemplate = (tpl) => {
    if (editing?.template?.id) {
      onSave(templates.map(t => t.id === editing.template.id ? { ...tpl, id: editing.template.id } : t));
    } else {
      onSave([...templates, { ...tpl, id: uid('tpl') }]);
    }
    setEditing(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#64748b', fontSize: 13 }}>
          Šablony platebních plánů můžete aplikovat na projekty pro automatické vygenerování splátek.
        </p>
        {!readOnly && (
          <button style={styles.primaryBtn} onClick={() => setEditing({})}>
            <Plus size={14} /> Nová šablona
          </button>
        )}
      </div>

      {templates.length === 0 ? (
        <div style={{ padding: 30, textAlign: 'center', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 8 }}>
          <FileText size={32} style={{ color: '#cbd5e1', marginBottom: 8 }} />
          <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
            Zatím nemáte žádné šablony.
          </p>
          <p style={{ color: '#94a3b8', fontSize: 12, margin: '4px 0 0' }}>
            Příklady: „30 % záloha + 60 % po dodání + 10 % po předání", „50 % záloha + 12 měs. splátek"
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {templates.map(t => (
            <div key={t.id} style={{ padding: 12, border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#0d3825' }}>{t.name}</div>
                  {t.description && (
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{t.description}</div>
                  )}
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                    {t.installments?.length || 0} {t.installments?.length === 1 ? 'splátka' : t.installments?.length < 5 ? 'splátky' : 'splátek'}
                  </div>
                </div>
                {!readOnly && (
                  <div style={{ display: 'flex', gap: 4 }}>
                    {confirmDel === t.id ? (
                      <>
                        <span style={{ fontSize: 11, color: '#dc2626', fontWeight: 600, alignSelf: 'center' }}>Smazat?</span>
                        <button onClick={() => removeTemplate(t.id)} style={{ ...styles.iconBtn, color: '#dc2626', background: '#fee2e2' }}><Trash2 size={12} /></button>
                        <button onClick={() => setConfirmDel(null)} style={styles.iconBtn}><X size={12} /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setEditing({ template: t })} style={styles.iconBtn} title="Upravit"><Edit3 size={12} /></button>
                        <button onClick={() => setConfirmDel(t.id)} style={styles.iconBtn} title="Smazat"><Trash2 size={12} /></button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Mini-přehled splátek */}
              {t.installments && t.installments.length > 0 && (
                <div style={{ marginTop: 8, padding: 8, background: '#f8fafc', borderRadius: 6, fontSize: 11 }}>
                  {t.installments.map((inst, idx) => {
                    const type = INSTALLMENT_TYPES.find(it => it.id === inst.type);
                    return (
                      <div key={idx} style={{ display: 'flex', gap: 8, padding: '2px 0', color: '#475569' }}>
                        <span style={{ minWidth: 20, color: '#94a3b8' }}>{idx + 1}.</span>
                        <span style={{ flex: 1 }}>{inst.label || '(bez popisu)'}</span>
                        <span style={{
                          padding: '1px 6px', borderRadius: 3, fontSize: 10, fontWeight: 600,
                          background: '#e0e7ff', color: '#3730a3',
                        }}>
                          {inst.type === 'fixed' && `${inst.amount} Kč`}
                          {inst.type === 'percent' && `${inst.amount} %`}
                          {inst.type === 'recurring' && `${inst.amount} měs.`}
                        </span>
                        <span style={{ color: '#94a3b8', minWidth: 130, textAlign: 'right', fontSize: 10 }}>
                          🚩 {inst.dueDateOffsetDays > 0 ? `milník + ${inst.dueDateOffsetDays} dní` : 'v den milníku'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {editing && (
        <PaymentTemplateEditModal
          template={editing.template}
          onSave={saveTemplate}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

// ==========================================================================
// PaymentTemplateEditModal — vytvořit / upravit šablonu
// ==========================================================================

function PaymentTemplateEditModal({ template, onSave, onClose }) {
  const [name, setName] = useState(template?.name || '');
  const [description, setDescription] = useState(template?.description || '');
  const [installments, setInstallments] = useState(
    template?.installments || []
  );

  const addInstallment = (type) => {
    const defaults = {
      fixed:     { label: 'Záloha', amount: 0, dueDateOffsetDays: 0 },
      percent:   { label: 'Záloha', amount: 30, dueDateOffsetDays: 0 },
      recurring: { label: 'Měsíční splátka zbytku', amount: 12, dueDateOffsetDays: 30 },
    };
    setInstallments([...installments, { type, ...defaults[type] }]);
  };

  const updateInstallment = (idx, patch) => {
    setInstallments(installments.map((it, i) => i === idx ? { ...it, ...patch } : it));
  };

  const removeInstallment = (idx) => {
    setInstallments(installments.filter((_, i) => i !== idx));
  };

  const moveUp = (idx) => {
    if (idx === 0) return;
    const next = [...installments];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    setInstallments(next);
  };
  const moveDown = (idx) => {
    if (idx === installments.length - 1) return;
    const next = [...installments];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    setInstallments(next);
  };

  // Kontrola: pokud jsou jen procenta, součet by měl být 100 (nebo s recurring < 100)
  const sumPercent = installments.filter(i => i.type === 'percent').reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
  const hasRecurring = installments.some(i => i.type === 'recurring');
  const hasFixed = installments.some(i => i.type === 'fixed');

  const submit = () => {
    if (!name.trim()) { alert('Zadejte název šablony.'); return; }
    if (installments.length === 0) { alert('Přidejte alespoň jednu splátku.'); return; }
    onSave({
      name: name.trim(),
      description: description.trim(),
      installments,
    });
  };

  return (
    <Modal title={template ? 'Upravit šablonu' : 'Nová šablona platebního plánu'} onClose={onClose} maxWidth={780}>
      <div style={styles.formRowGroup}>
        <div style={{ flex: 2 }}>
          <label style={styles.label}>Název šablony *</label>
          <input style={styles.input} value={name} onChange={e => setName(e.target.value)}
            placeholder="např. Standard FVE - 30/60/10" autoFocus />
        </div>
      </div>
      <div style={styles.formRow}>
        <label style={styles.label}>Popis (volitelně)</label>
        <input style={styles.input} value={description} onChange={e => setDescription(e.target.value)}
          placeholder="např. 30 % záloha při podpisu, 60 % po dodání, 10 % po předání" />
      </div>

      <h3 style={{ margin: '16px 0 8px', fontSize: 14 }}>
        Splátky ({installments.length})
        {sumPercent !== 0 && (
          <span style={{ fontSize: 12, fontWeight: 500, color: sumPercent === 100 ? '#10b981' : (hasRecurring ? '#64748b' : '#f59e0b'), marginLeft: 8 }}>
            · součet procent: {sumPercent}%
            {sumPercent !== 100 && !hasRecurring && !hasFixed && ' ⚠ doporučujeme 100% nebo přidat fixní/recurring'}
            {sumPercent < 100 && hasRecurring && ' (zbytek se rozdělí do měs. splátek)'}
          </span>
        )}
      </h3>

      {installments.length === 0 ? (
        <div style={{ padding: 20, textAlign: 'center', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 8, marginBottom: 8 }}>
          <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Žádné splátky. Přidejte první níže.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
          {installments.map((inst, idx) => {
            const type = INSTALLMENT_TYPES.find(t => t.id === inst.type);
            return (
              <div key={idx} style={{
                padding: 10, border: '1px solid #e2e8f0', borderRadius: 6, background: '#fff',
              }}>
                {/* Horní řádek: pořadí, název, částka, mazat */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '20px 1fr auto auto', gap: 8, alignItems: 'center',
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <button type="button" onClick={() => moveUp(idx)} disabled={idx === 0}
                      style={{ padding: 0, lineHeight: 1, fontSize: 9, background: 'transparent', border: 'none', color: idx === 0 ? '#cbd5e1' : '#64748b', cursor: idx === 0 ? 'default' : 'pointer' }}>▲</button>
                    <button type="button" onClick={() => moveDown(idx)} disabled={idx === installments.length - 1}
                      style={{ padding: 0, lineHeight: 1, fontSize: 9, background: 'transparent', border: 'none', color: idx === installments.length - 1 ? '#cbd5e1' : '#64748b', cursor: idx === installments.length - 1 ? 'default' : 'pointer' }}>▼</button>
                  </div>
                  <input
                    style={{ ...styles.input, padding: '6px 8px', fontSize: 12 }}
                    value={inst.label || ''}
                    onChange={e => updateInstallment(idx, { label: e.target.value })}
                    placeholder="Název milníku (např. Závoz materiálu, Provedení UTP, Revizní zpráva)"
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <input
                      type="number"
                      step="0.01"
                      style={{ ...styles.input, padding: '6px 8px', fontSize: 12, width: 100, textAlign: 'right' }}
                      value={inst.amount || ''}
                      onChange={e => updateInstallment(idx, { amount: parseFloat(e.target.value) || 0 })}
                    />
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '4px 8px', borderRadius: 4,
                      background: inst.type === 'fixed' ? '#dbeafe' : inst.type === 'percent' ? '#dcfce7' : '#fef3c7',
                      color: inst.type === 'fixed' ? '#1e40af' : inst.type === 'percent' ? '#166534' : '#92400e',
                      minWidth: 36, textAlign: 'center',
                    }} title={type?.label}>{type?.shortLabel}</span>
                  </div>
                  <button type="button" onClick={() => removeInstallment(idx)}
                    style={{ ...styles.iconBtn, color: '#dc2626' }} title="Odebrat splátku">
                    <Trash2 size={12} />
                  </button>
                </div>

                {/* Dolní řádek: offset po milníku */}
                <div style={{
                  marginTop: 6, paddingLeft: 28,
                  display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748b', flexWrap: 'wrap',
                }}>
                  <span style={{ fontWeight: 600 }}>🚩 Splatnost:</span>
                  <span>{inst.dueDateOffsetDays > 0 ? 'po milníku +' : 'v den milníku'}</span>
                  {inst.dueDateOffsetDays === 0 ? null : null}
                  <input
                    type="number"
                    min="0"
                    style={{
                      padding: '4px 6px', fontSize: 11, fontFamily: 'inherit',
                      border: '1px solid #cbd5e1', borderRadius: 4, width: 60, textAlign: 'right',
                    }}
                    value={inst.dueDateOffsetDays || 0}
                    onChange={e => updateInstallment(idx, { dueDateOffsetDays: parseInt(e.target.value, 10) || 0 })}
                  />
                  <span>dní</span>
                  <span style={{ fontSize: 10, color: '#3730a3', background: '#e0e7ff', padding: '2px 6px', borderRadius: 3, marginLeft: 'auto' }}>
                    Datum milníku zadáte při použití šablony
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Přidat splátku */}
      <div style={{ marginTop: 10, padding: 10, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Přidat splátku:</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {INSTALLMENT_TYPES.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => addInstallment(t.id)}
              style={{
                padding: '8px 12px', fontSize: 12, fontWeight: 600,
                border: '1px solid #cbd5e1', borderRadius: 6, background: '#fff', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'inherit',
              }}
              title={t.description}
            >
              <Plus size={12} /> {t.label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: '#94a3b8' }}>
          • <strong>Fixní</strong> = pevná částka v Kč  &nbsp; • <strong>Procento</strong> = % z hodnoty projektu  &nbsp; • <strong>Měsíční</strong> = zbytek hodnoty rozdělený do X měsíců
        </div>
        <div style={{ marginTop: 4, fontSize: 11, color: '#3730a3', background: '#e0e7ff', padding: 6, borderRadius: 4 }}>
          💡 <strong>Každá splátka je vlastní milník.</strong> Splatnost = datum milníku + počet dní (typicky +14 pro běžnou platební dobu). Datumy konkrétních milníků zadáte teprve při aplikaci šablony na projekt.
        </div>
      </div>

      <div style={styles.modalActions}>
        <button style={styles.secondaryBtn} onClick={onClose}>Zrušit</button>
        <button style={styles.primaryBtn} onClick={submit}>{template ? 'Uložit změny' : 'Vytvořit šablonu'}</button>
      </div>
    </Modal>
  );
}

// ==========================================================================
// PdfArchiveSettingsTab — archiv importovaných PDF dokumentů
// ==========================================================================

function PdfArchiveSettingsTab({ attachments, projects, onDelete, readOnly }) {
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [openingId, setOpeningId] = useState(null);
  const [error, setError] = useState('');
  const [zipping, setZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);

  // Odhadovaná velikost úložiště
  const [storageInfo, setStorageInfo] = useState(null);
  useEffect(() => {
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then(est => {
        setStorageInfo({
          used: est.usage || 0,
          quota: est.quota || 0,
        });
      });
    }
  }, [attachments]);

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} kB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
  };

  const openPdf = async (attachmentId) => {
    setError('');
    setOpeningId(attachmentId);
    try {
      // Otevřít v novém tabu přes blob URL
      const record = await getPdfFromDb(attachmentId);
      if (!record) throw new Error('PDF již není v databázi (možná bylo smazáno).');
      const bytes = Uint8Array.from(atob(record.base64), c => c.charCodeAt(0));
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      // Použít <a> místo window.open aby fungovalo i s blokátory pop-upů
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (e) {
      console.error(e);
      setError(e.message || 'Nepodařilo se otevřít PDF.');
    } finally {
      setOpeningId(null);
    }
  };

  const downloadPdf = async (attachment) => {
    setError('');
    try {
      const record = await getPdfFromDb(attachment.id);
      if (!record) throw new Error('PDF již není v databázi.');
      const bytes = Uint8Array.from(atob(record.base64), c => c.charCodeAt(0));
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = buildFilename(attachment);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (e) {
      console.error(e);
      setError(e.message || 'Nepodařilo se stáhnout PDF.');
    }
  };

  // Stáhnout všechna PDF jako jeden ZIP archiv
  const downloadAllAsZip = async () => {
    setError('');
    setZipping(true);
    setZipProgress(0);
    try {
      const JSZip = await loadJSZip();
      const zip = new JSZip();
      const usedNames = new Set(); // pro rozlišení duplicitních názvů

      for (let i = 0; i < attachments.length; i++) {
        const att = attachments[i];
        try {
          const record = await getPdfFromDb(att.id);
          if (!record) {
            console.warn(`PDF ${att.filename} není v databázi, přeskakuji.`);
            continue;
          }
          // Vygenerovat unikátní název (přidat suffix pokud kolize)
          let filename = buildFilename(att);
          let baseName = filename.replace(/\.pdf$/i, '');
          let n = 2;
          while (usedNames.has(filename)) {
            filename = `${baseName}_${n}.pdf`;
            n += 1;
          }
          usedNames.add(filename);

          // Přidat do ZIPu (raw base64 → binary)
          const bytes = Uint8Array.from(atob(record.base64), c => c.charCodeAt(0));
          zip.file(filename, bytes);
        } catch (e) {
          console.error(`Chyba při přidávání ${att.filename}:`, e);
        }
        setZipProgress(Math.round(((i + 1) / attachments.length) * 100));
      }

      // Generovat ZIP
      const blob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 },
      }, (metadata) => {
        // Poslední fáze: komprese
        setZipProgress(Math.round(metadata.percent));
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PDF_archiv_Electree_${todayISO()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (e) {
      console.error(e);
      setError(e.message || 'Nepodařilo se vytvořit ZIP archiv.');
    } finally {
      setZipping(false);
      setZipProgress(0);
    }
  };

  // Seřazené sestupně podle data importu
  const sorted = [...attachments].sort((a, b) =>
    (b.importedAt || '').localeCompare(a.importedAt || '')
  );

  return (
    <div>
      <div style={{ padding: 10, marginBottom: 12, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, fontSize: 12, color: '#1e40af' }}>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>📁 Kde jsou PDF uložená?</div>
        <div>
          PDF se ukládají do <strong>IndexedDB</strong> vašeho prohlížeče (název databáze: <code>fve-planner-pdfs</code>).
          To znamená, že soubory jsou <strong>jen na tomto počítači</strong> — když otevřete aplikaci z jiného zařízení,
          PDF tam nebudou. Zálohování dat (v záložce „Zálohování") <strong>PDF neobsahuje</strong>, jen odkazy na ně.
        </div>
        {storageInfo && (
          <div style={{ marginTop: 6, fontSize: 11 }}>
            Prohlížeč využívá {formatBytes(storageInfo.used)} z {formatBytes(storageInfo.quota)} dostupných.
          </div>
        )}
      </div>

      {error && (
        <div style={{ padding: 10, marginBottom: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, fontSize: 12, color: '#991b1b' }}>
          <strong>Chyba:</strong> {error}
        </div>
      )}

      {attachments.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, padding: '8px 10px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 6 }}>
          <div style={{ fontSize: 12, color: '#166534' }}>
            💾 <strong>Chcete si udělat zálohu?</strong> Stáhněte si všechny PDF jako jeden ZIP archiv.
          </div>
          <button
            onClick={downloadAllAsZip}
            disabled={zipping}
            style={{
              padding: '6px 12px', fontSize: 12, fontWeight: 600,
              background: zipping ? '#94a3b8' : '#166534',
              color: '#fff', border: 'none', borderRadius: 4,
              cursor: zipping ? 'default' : 'pointer', fontFamily: 'inherit',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              minWidth: 180, justifyContent: 'center',
            }}
          >
            {zipping ? (
              <>
                <span style={{
                  width: 12, height: 12, border: '2px solid #fff', borderTopColor: 'transparent',
                  borderRadius: '50%', animation: 'spin 0.8s linear infinite',
                }} />
                Připravuji ZIP... {zipProgress}%
              </>
            ) : (
              <>
                <Download size={13} /> Stáhnout vše ({attachments.length}) jako ZIP
              </>
            )}
          </button>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {attachments.length === 0 ? (
        <div style={{ padding: 30, textAlign: 'center', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 8 }}>
          <FileText size={32} style={{ color: '#cbd5e1', marginBottom: 8 }} />
          <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
            Zatím nemáte žádné importované PDF.
          </p>
          <p style={{ color: '#94a3b8', fontSize: 12, margin: '4px 0 0' }}>
            Použijte <strong>Objednávky → Import z PDF (AI)</strong> pro automatické načtení faktury nebo objednávky.
          </p>
        </div>
      ) : (
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'auto' }}>
          <table style={{ ...styles.table, fontSize: 12 }}>
            <thead>
              <tr>
                <th style={styles.th}>Soubor</th>
                <th style={styles.th}>Dodavatel</th>
                <th style={styles.th}>Č. faktury</th>
                <th style={styles.th}>Projekt</th>
                <th style={styles.th}>Importováno</th>
                <th style={styles.th}>Položek</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Akce</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(att => {
                const proj = projects.find(p => p.id === att.projectId);
                return (
                  <tr key={att.id} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <FileText size={14} style={{ color: '#dc2626' }} />
                        <span style={{ fontWeight: 500 }}>{att.filename}</span>
                      </div>
                    </td>
                    <td style={{ ...styles.td, fontSize: 11 }}>{att.supplierName || '—'}</td>
                    <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: 11 }}>{att.orderNumber || '—'}</td>
                    <td style={{ ...styles.td, fontSize: 11 }}>
                      {proj ? (
                        <>
                          <div>{proj.name}</div>
                          {proj.client && <div style={{ fontSize: 10, color: '#94a3b8' }}>{proj.client}</div>}
                        </>
                      ) : <span style={{ color: '#94a3b8' }}>(smazaný projekt)</span>}
                    </td>
                    <td style={{ ...styles.td, fontSize: 11, color: '#64748b' }}>
                      {att.importedAt ? new Date(att.importedAt).toLocaleString('cs-CZ', {
                        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
                      }) : '—'}
                    </td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>
                      <span style={{
                        padding: '2px 8px', borderRadius: 3, fontSize: 11, fontWeight: 600,
                        background: '#e0e7ff', color: '#3730a3',
                      }}>{att.itemCount || 0}</span>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 4 }}>
                        <button
                          onClick={() => openPdf(att.id)}
                          disabled={openingId === att.id}
                          style={{
                            ...styles.sortBtn,
                            background: '#0d3825', color: '#fff', borderColor: '#0d3825',
                          }}
                          title="Otevřít PDF v novém tabu"
                        >
                          <Eye size={12} /> Otevřít
                        </button>
                        <button
                          onClick={() => downloadPdf(att)}
                          style={styles.sortBtn}
                          title="Stáhnout PDF do počítače"
                        >
                          <Download size={12} />
                        </button>
                        {!readOnly && (
                          confirmDelete === att.id ? (
                            <>
                              <button
                                onClick={() => { onDelete(att.id); setConfirmDelete(null); }}
                                style={{ ...styles.sortBtn, color: '#dc2626', background: '#fee2e2', borderColor: '#fecaca' }}
                              >
                                Smazat
                              </button>
                              <button
                                onClick={() => setConfirmDelete(null)}
                                style={styles.sortBtn}
                              >
                                <X size={12} />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => setConfirmDelete(att.id)}
                              style={{ ...styles.sortBtn, color: '#dc2626' }}
                              title="Smazat PDF z archivu"
                            >
                              <Trash2 size={12} />
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {attachments.length > 0 && (
        <div style={{ marginTop: 12, fontSize: 11, color: '#64748b' }}>
          <strong>{attachments.length}</strong> {attachments.length === 1 ? 'PDF' : attachments.length < 5 ? 'PDF' : 'PDF'} v archivu.
          Celkem <strong>{attachments.reduce((s, a) => s + (a.itemCount || 0), 0)}</strong> importovaných položek.
        </div>
      )}
    </div>
  );
}

// ==========================================================================
// Backup / Restore tab — export/import všech dat aplikace
// ==========================================================================

function BackupSettingsTab({ fullData, onRestoreData, onClose }) {
  const [importPreview, setImportPreview] = useState(null); // { newData, summary }
  const [importError, setImportError] = useState('');
  const [importStep, setImportStep] = useState('idle'); // 'idle' | 'preview' | 'confirm'
  const fileInputRef = useRef(null);

  const exportAll = () => {
    const exportData = {
      _appName: 'CashFlow Planner',
      _appVersion: APP_VERSION,
      _exportedAt: new Date().toISOString(),
      _storageKey: STORAGE_KEY,
      data: fullData,
    };
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CashFlow_Planner_zaloha_${todayISO()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleFileSelect = (e) => {
    setImportError('');
    setImportPreview(null);
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(String(ev.target.result || ''));
        // Validace: očekáváme formát z exportAll
        if (!parsed.data || typeof parsed.data !== 'object') {
          throw new Error('Soubor neobsahuje očekávanou strukturu (chybí klíč "data").');
        }
        const d = parsed.data;
        if (!Array.isArray(d.projects)) {
          throw new Error('Chybí pole "projects".');
        }
        // Vytvořit přehled obsahu
        const summary = {
          projects: d.projects?.length || 0,
          categories: d.categories?.length || 0,
          suppliers: d.suppliers?.length || 0,
          catalog: d.catalog?.length || 0,
          locations: d.locations?.length || 0,
          stockItems: d.stockItems?.length || 0,
          stockMovements: d.stockMovements?.length || 0,
          exportedAt: parsed._exportedAt || 'neznámé datum',
          appVersion: parsed._appVersion || 'neznámá verze',
        };
        setImportPreview({ newData: d, summary });
        setImportStep('preview');
      } catch (err) {
        setImportError('Chyba při čtení souboru: ' + (err?.message || 'neplatný JSON formát'));
      }
    };
    reader.onerror = () => setImportError('Chyba při čtení souboru z disku.');
    reader.readAsText(file);
    // Reset input aby šel zvolit stejný soubor podruhé
    e.target.value = '';
  };

  const confirmImport = () => {
    if (!importPreview) return;
    // Před importem: udělat automatickou bezpečnostní zálohu
    const safetyBackup = {
      _appName: 'CashFlow Planner',
      _appVersion: APP_VERSION,
      _exportedAt: new Date().toISOString(),
      _note: 'AUTOMATICKÁ záloha před importem — pro případ návratu',
      _storageKey: STORAGE_KEY,
      data: fullData,
    };
    const json = JSON.stringify(safetyBackup, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CashFlow_Planner_PRED_IMPORTEM_${todayISO()}_${Date.now()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    // Nahradit data
    onRestoreData(importPreview.newData);
    setImportPreview(null);
    setImportStep('idle');
    onClose();
  };

  const cancelImport = () => {
    setImportPreview(null);
    setImportStep('idle');
    setImportError('');
  };

  // Statistika aktuálních dat
  const currentStats = {
    projects: fullData?.projects?.length || 0,
    categories: fullData?.categories?.length || 0,
    suppliers: fullData?.suppliers?.length || 0,
    catalog: fullData?.catalog?.length || 0,
    locations: fullData?.locations?.length || 0,
    stockItems: fullData?.stockItems?.length || 0,
    stockMovements: fullData?.stockMovements?.length || 0,
  };

  return (
    <div>
      {/* EXPORT sekce */}
      <div style={{
        padding: 16, marginBottom: 16, borderRadius: 8,
        background: '#f0fdf4', border: '1px solid #bbf7d0',
      }}>
        <h3 style={{ margin: '0 0 8px', fontSize: 15, color: '#166534', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Download size={16} /> Export všech dat
        </h3>
        <p style={{ margin: '0 0 12px', fontSize: 13, color: '#166534', lineHeight: 1.5 }}>
          Stáhne kompletní zálohu (projekty, položky, dodavatelé, kategorie, katalog, sklad) jako JSON soubor.
          Použijte pro pravidelné zálohy nebo přenos dat na jiný počítač.
        </p>
        <div style={{ fontSize: 12, color: '#475569', marginBottom: 12, padding: 10, background: 'rgba(255,255,255,0.6)', borderRadius: 6 }}>
          <strong>Aktuální obsah:</strong> {currentStats.projects} projektů, {currentStats.suppliers} dodavatelů,
          {' '}{currentStats.catalog} položek v katalogu, {currentStats.categories} kategorií,
          {' '}{currentStats.stockItems} skladových kusů, {currentStats.stockMovements} pohybů
        </div>
        <button style={styles.primaryBtn} onClick={exportAll}>
          <Download size={15} /> Stáhnout zálohu (JSON)
        </button>
      </div>

      {/* IMPORT sekce */}
      <div style={{
        padding: 16, borderRadius: 8,
        background: '#fef3c7', border: '1px solid #fcd34d',
      }}>
        <h3 style={{ margin: '0 0 8px', fontSize: 15, color: '#92400e', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Upload size={16} /> Obnova ze zálohy
        </h3>
        <p style={{ margin: '0 0 12px', fontSize: 13, color: '#92400e', lineHeight: 1.5 }}>
          <strong>Pozor:</strong> Import <strong>nahradí všechna aktuální data</strong> daty ze souboru.
          Před nahrazením se automaticky stáhne bezpečnostní záloha aktuálního stavu (pro případ vrácení).
        </p>

        {importStep === 'idle' && (
          <>
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileSelect} style={{ display: 'none' }} />
            <button
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '9px 16px', borderRadius: 999,
                background: '#92400e', color: '#fff',
                fontSize: 13, fontWeight: 600,
                border: '1px solid #92400e',
                fontFamily: 'inherit', cursor: 'pointer',
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={15} /> Vybrat JSON soubor zálohy
            </button>
          </>
        )}

        {importError && (
          <div style={{ marginTop: 12, padding: 10, background: '#fee2e2', color: '#b91c1c', borderRadius: 6, fontSize: 13 }}>
            {importError}
          </div>
        )}

        {importStep === 'preview' && importPreview && (
          <div style={{ marginTop: 12, padding: 12, background: 'rgba(255,255,255,0.7)', borderRadius: 6 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#92400e', marginBottom: 8 }}>
              Náhled obsahu zálohy:
            </div>
            <table style={{ width: '100%', fontSize: 12, color: '#475569' }}>
              <tbody>
                <tr><td style={{ padding: '2px 0' }}>Datum exportu:</td><td><strong>{importPreview.summary.exportedAt}</strong></td></tr>
                <tr><td>Verze aplikace:</td><td><strong>{importPreview.summary.appVersion}</strong></td></tr>
                <tr><td colSpan={2} style={{ paddingTop: 8, borderTop: '1px solid #fcd34d' }}></td></tr>
                <tr><td>Projekty:</td><td><strong>{importPreview.summary.projects}</strong> (aktuálně: {currentStats.projects})</td></tr>
                <tr><td>Dodavatelé:</td><td><strong>{importPreview.summary.suppliers}</strong> (aktuálně: {currentStats.suppliers})</td></tr>
                <tr><td>Katalogové položky:</td><td><strong>{importPreview.summary.catalog}</strong> (aktuálně: {currentStats.catalog})</td></tr>
                <tr><td>Kategorie:</td><td><strong>{importPreview.summary.categories}</strong> (aktuálně: {currentStats.categories})</td></tr>
                <tr><td>Skladové lokace:</td><td><strong>{importPreview.summary.locations || 0}</strong> (aktuálně: {currentStats.locations})</td></tr>
                <tr><td>Skladové kusy:</td><td><strong>{importPreview.summary.stockItems || 0}</strong> (aktuálně: {currentStats.stockItems})</td></tr>
                <tr><td>Skladové pohyby:</td><td><strong>{importPreview.summary.stockMovements || 0}</strong> (aktuálně: {currentStats.stockMovements})</td></tr>
              </tbody>
            </table>
            <div style={{ marginTop: 12, padding: 10, background: '#fee2e2', color: '#b91c1c', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
              ⚠ Po potvrzení budou aktuální data NAHRAZENA daty ze zálohy.
              Aktuální stav se nejdříve automaticky stáhne jako bezpečnostní záloha.
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button style={styles.sortBtn} onClick={cancelImport}>Zrušit</button>
              <button style={{ ...styles.primaryBtn, background: '#dc2626' }} onClick={confirmImport}>
                Provést import (nahradí data)
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: 16, padding: 12, background: '#f1f5f9', borderRadius: 6, fontSize: 12, color: '#475569', lineHeight: 1.6 }}>
        <strong>💡 Tipy pro sdílení dat napříč počítači:</strong>
        <ul style={{ margin: '6px 0 0 18px', padding: 0 }}>
          <li>Pro pravidelné zálohy — exportujte týdně, ukládejte do OneDrive nebo SharePoint</li>
          <li>Pro sdílení s kolegou — vyexportujte, pošlete soubor (e-mailem, OneDrive, Teams), kolega importuje</li>
          <li>Vždy pracuje jen jeden — pokud upravujete oba současně, poslední import přepíše předchozí změny</li>
          <li>Při importu se VŽDY stáhne bezpečnostní záloha — můžete ji zase importovat zpět pokud něco nesedí</li>
        </ul>
      </div>
    </div>
  );
}
// ==========================================================================
// Item / Budget / Category / Supplier / Catalog / Import modals
// ==========================================================================

function ItemModal({ item, categories, suppliers, catalog, exchangeRate, onSave, onClose, onOpenSuppliers, onOpenCatalog }) {
  const [form, setForm] = useState(item || {
    category: categories[0]?.id || '',
    name: '', supplier: '', supplierId: '', catalogId: '',
    quantity: 1, unit: 'pcs', unitPrice: 0, currency: 'CZK',
    status: 'planned',
    // Planned dates (for cash flow before ordering)
    plannedOrderDate: '', plannedDeliveryDate: '',
    // Actual dates (set when milestones hit)
    purchaseDate: '', deliveredDate: '', invoicedDate: '',
    paymentDueDate: '',
    orderNumber: '',
    notes: '',
  });

  const selectedSupplier = suppliers.find(s => s.id === form.supplierId);
  const supplierCatalog = useMemo(() => form.supplierId ? catalog.filter(c => c.supplierId === form.supplierId) : [], [catalog, form.supplierId]);
  const linkedCatalog = form.catalogId ? catalog.find(c => c.id === form.catalogId) : null;

  useEffect(() => {
    if (linkedCatalog) {
      setForm(f => ({ ...f, name: linkedCatalog.name, unit: linkedCatalog.unit || f.unit, unitPrice: linkedCatalog.unitPrice, currency: linkedCatalog.currency || 'CZK' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkedCatalog?.unitPrice, linkedCatalog?.name, linkedCatalog?.unit, linkedCatalog?.currency]);

  const lineTotal = (parseFloat(form.quantity) || 0) * (parseFloat(form.unitPrice) || 0);
  const lineCZK = form.currency === 'EUR' ? lineTotal * exchangeRate : lineTotal;
  const payments = useMemo(() => computePayments(form, selectedSupplier, lineCZK), [form, selectedSupplier, lineCZK]);

  const handleSupplierChange = (newSupplierId) => {
    setForm(f => {
      const patch = { ...f, supplierId: newSupplierId };
      if (newSupplierId) patch.supplier = '';
      if (f.catalogId) {
        const linked = catalog.find(c => c.id === f.catalogId);
        if (!linked || linked.supplierId !== newSupplierId) patch.catalogId = '';
      }
      return patch;
    });
  };

  const handleCatalogPick = (catId) => {
    if (!catId) { setForm(f => ({ ...f, catalogId: '' })); return; }
    const entry = catalog.find(c => c.id === catId);
    if (!entry) return;
    setForm(f => ({ ...f, catalogId: entry.id, name: entry.name, unit: entry.unit || f.unit, unitPrice: entry.unitPrice, currency: entry.currency || 'CZK' }));
  };

  const isFieldOverridden = (field) => {
    if (!linkedCatalog) return false;
    if (field === 'name') return form.name !== linkedCatalog.name;
    if (field === 'unit') return (form.unit || '') !== (linkedCatalog.unit || '');
    if (field === 'unitPrice') return parseFloat(form.unitPrice) !== parseFloat(linkedCatalog.unitPrice);
    if (field === 'currency') return form.currency !== (linkedCatalog.currency || 'CZK');
    return false;
  };
  const anyOverride = ['name', 'unit', 'unitPrice', 'currency'].some(isFieldOverridden);

  const submit = () => {
    if (!form.name.trim() || !form.category) return;
    let catalogId = form.catalogId;
    if (anyOverride) catalogId = '';
    onSave({
      ...form, catalogId, name: form.name.trim(),
      supplier: selectedSupplier ? '' : (form.supplier || '').trim(),
      notes: (form.notes || '').trim(),
      orderNumber: (form.orderNumber || '').trim(),
      quantity: parseFloat(form.quantity) || 0,
      unitPrice: parseFloat(form.unitPrice) || 0,
    });
  };

  const status = form.status || 'planned';
  const isOrdered = status !== 'planned';

  return (
    <Modal title={item ? 'Upravit položku' : 'Přidat položku'} onClose={onClose} maxWidth={720}>
      <div style={styles.formRowGroup}>
        <div style={{ flex: 2 }}>
          <label style={styles.label}>Kategorie *</label>
          <select style={styles.input} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            <optgroup label="Materiál">{categories.filter(c => c.kind === 'material').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</optgroup>
            <optgroup label="Práce a subdodavatelé">{categories.filter(c => c.kind === 'labor').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</optgroup>
            <optgroup label="Provize a řízení">{categories.filter(c => c.kind === 'commission').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</optgroup>
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Stav</label>
          <select style={styles.input} value={status} onChange={e => setForm({ ...form, status: e.target.value })}>
            {STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* Supplier — optional */}
      <div style={styles.formRow}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
          <label style={{ ...styles.label, margin: 0 }}>Dodavatel / kontraktor <span style={{ color: '#94a3b8', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(volitelné — přiřaďte později v Nákupním seznamu)</span></label>
          <div style={{ display: 'flex', gap: 4 }}>
            <button type="button" style={styles.sortBtn} onClick={onOpenSuppliers}><Settings size={11} /> Spravovat</button>
          </div>
        </div>
        {suppliers.length > 0 ? (
          <select style={styles.input} value={form.supplierId || ''} onChange={e => handleSupplierChange(e.target.value)}>
            <option value="">— Bez dodavatele (nastavit později) —</option>
            {suppliers.map(s => {
              const parts = [];
              if (s.depositPercent > 0) parts.push(`${s.depositPercent}% dep`);
              if (s.paymentTermsDays != null && s.paymentTermsDays !== '') parts.push(`Net ${s.paymentTermsDays}`);
              return <option key={s.id} value={s.id}>{s.name}{parts.length ? ` · ${parts.join(', ')}` : ''}</option>;
            })}
          </select>
        ) : (
          <input style={styles.input} value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })} placeholder="Název dodavatele (optional)" />
        )}
        {suppliers.length > 0 && !form.supplierId && (
          <input style={{ ...styles.input, marginTop: 6 }} value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })} placeholder="Nebo zadejte vlastní název dodavatele (volitelné)" />
        )}
      </div>

      {/* Catalog pick — only if supplier selected AND catalog has items */}
      {form.supplierId && supplierCatalog.length > 0 && (
        <div style={styles.formRow}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
            <label style={{ ...styles.label, margin: 0 }}>Katalogová položka <span style={{ color: '#94a3b8', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(volitelné — nebo zadejte vlastní níže)</span></label>
            <button type="button" style={styles.sortBtn} onClick={onOpenCatalog}><BookOpen size={11} /> Spravovat</button>
          </div>
          <select style={styles.input} value={form.catalogId || ''} onChange={e => handleCatalogPick(e.target.value)}>
            <option value="">— Vlastní položka (vyplňte pole níže) —</option>
            {supplierCatalog.map(c => (
              <option key={c.id} value={c.id}>{c.name} · {fmt2(c.unitPrice, c.currency || 'CZK')} / {c.unit || 'pcs'}</option>
            ))}
          </select>
          {linkedCatalog && (
            <div style={{ fontSize: 11, color: anyOverride ? '#d97706' : '#3b82f6', marginTop: 4 }}>
              {anyOverride ? '⚠ Upravené hodnoty — uloží se jako vlastní (nepropojená) položka' : '✓ Propojeno s katalogem (živé aktualizace cen)'}
            </div>
          )}
        </div>
      )}

      {/* Item fields */}
      <div style={styles.formRow}>
        <label style={styles.label}>Název položky / služby *</label>
        <input autoFocus={!linkedCatalog} style={{ ...styles.input, background: linkedCatalog && !isFieldOverridden('name') ? '#f0f9ff' : '#fff' }}
          value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. JA Solar 450W panels" />
      </div>

      <div style={styles.formRowGroup}>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Množství *</label>
          <input type="number" step="0.01" style={styles.input} value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Jednotka</label>
          <select style={{ ...styles.input, background: linkedCatalog && !isFieldOverridden('unit') ? '#f0f9ff' : '#fff' }}
            value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}>
            <option value="pcs">pcs</option><option value="m">m</option><option value="m²">m²</option><option value="kg">kg</option>
            <option value="set">set</option><option value="pack">pack</option><option value="hr">hr</option><option value="day">day</option>
            <option value="%">%</option><option value="lump">lump sum</option>
          </select>
        </div>
        <div style={{ flex: 1.3 }}>
          <label style={styles.label}>Jednotková cena *</label>
          <input type="number" step="0.01" style={{ ...styles.input, background: linkedCatalog && !isFieldOverridden('unitPrice') ? '#f0f9ff' : '#fff' }}
            value={form.unitPrice} onChange={e => setForm({ ...form, unitPrice: e.target.value })} />
        </div>
        <div style={{ flex: 0.8 }}>
          <label style={styles.label}>Měna *</label>
          <select style={{ ...styles.input, background: linkedCatalog && !isFieldOverridden('currency') ? '#f0f9ff' : '#fff' }}
            value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}>
            <option value="CZK">CZK</option><option value="EUR">EUR</option>
          </select>
        </div>
      </div>

      {/* PLANNED DATES — always visible, drive cash flow before ordering */}
      <div style={styles.dateSection}>
        <div style={styles.dateSectionHeader}>
          <Clock size={12} /> Plánovaná data <span style={{ color: '#94a3b8', fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: 11 }}>— ovlivňují prognózu cash flow, dokud skutečně neobjednáte</span>
        </div>
        <div style={styles.formRowGroup}>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Plán. datum objednávky</label>
            <input type="date" style={styles.input} value={form.plannedOrderDate || ''} onChange={e => setForm({ ...form, plannedOrderDate: e.target.value })} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Plán. datum dodání</label>
            <input type="date" style={styles.input} value={form.plannedDeliveryDate || ''} onChange={e => setForm({ ...form, plannedDeliveryDate: e.target.value })} />
          </div>
        </div>
      </div>

      {/* ACTUAL DATES — faded when not ordered yet (suggest using Purchase List/Orders workflow) */}
      <div style={{ ...styles.dateSection, background: '#fef3c7', borderColor: '#fcd34d' }}>
        <div style={styles.dateSectionHeader}>
          <CheckCircle2 size={12} /> Skutečná data <span style={{ color: '#92400e', fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: 11 }}>— obvykle se nastaví přes Nákupní seznam / Objednávky</span>
        </div>
        {isOrdered && (
          <div style={styles.formRow}>
            <label style={styles.label}>Číslo objednávky</label>
            <input style={styles.input} value={form.orderNumber || ''} onChange={e => setForm({ ...form, orderNumber: e.target.value })} placeholder="e.g. PO-2026-0042" />
          </div>
        )}
        <div style={styles.formRowGroup}>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Skut. datum objednávky</label>
            <input type="date" style={styles.input} value={form.purchaseDate || ''} onChange={e => setForm({ ...form, purchaseDate: e.target.value })} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Skut. datum dodání</label>
            <input type="date" style={styles.input} value={form.deliveredDate || ''} onChange={e => setForm({ ...form, deliveredDate: e.target.value })} />
          </div>
        </div>
        <div style={styles.formRowGroup}>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Datum fakturace</label>
            <input type="date" style={styles.input} value={form.invoicedDate || ''} onChange={e => setForm({ ...form, invoicedDate: e.target.value })} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Splatnost (přepsat)</label>
            <input type="date" style={styles.input} value={form.paymentDueDate || ''} onChange={e => setForm({ ...form, paymentDueDate: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Payment schedule preview */}
      {lineCZK > 0 && (form.plannedOrderDate || form.purchaseDate) && (
        <div style={{ ...styles.totalPreview, borderLeftColor: '#6366f1' }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Platební plán {payments.some(p => p.basis === 'planned') && <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 400 }}>(podle plánovaných dat)</span>}</div>
          {payments.map((p, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 2 }}>
              <span style={{ color: '#64748b' }}>
                {p.label}
                {p.basis === 'planned' && <span style={{ marginLeft: 6, fontSize: 10, padding: '1px 5px', borderRadius: 3, background: '#f1f5f9', color: '#64748b' }}>plánované</span>}
                {p.basis === 'actual' && <span style={{ marginLeft: 6, fontSize: 10, padding: '1px 5px', borderRadius: 3, background: '#dcfce7', color: '#15803d' }}>skutečné</span>}
              </span>
              <span><strong>{fmt(p.amount)}</strong> <span style={{ color: p.dueDate ? '#0f172a' : '#dc2626', marginLeft: 8 }}>{p.dueDate || '⚠ chybí spouštěcí datum'}</span></span>
            </div>
          ))}
        </div>
      )}

      <div style={styles.formRow}>
        <label style={styles.label}>Poznámky</label>
        <input style={styles.input} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
      </div>

      <div style={styles.totalPreview}>
        Line total: <strong>{fmt2(lineTotal, form.currency)}</strong>
        {form.currency === 'EUR' && <> → <strong>{fmt(lineCZK)}</strong></>}
      </div>

      <div style={styles.modalActions}>
        <button style={styles.secondaryBtn} onClick={onClose}>Zrušit</button>
        <button style={styles.primaryBtn} onClick={submit}>{item ? 'Uložit změny' : 'Přidat položku'}</button>
      </div>
    </Modal>
  );
}

function BudgetModal({ categories, budgets, onSave, onClose }) {
  const [form, setForm] = useState({ ...budgets });
  const total = Object.values(form).reduce((a, b) => a + (parseFloat(b) || 0), 0);
  const groups = [
    { kind: 'material', label: 'Materiál' },
    { kind: 'labor', label: 'Práce a subdodavatelé' },
    { kind: 'commission', label: 'Provize a řízení' },
  ];
  return (
    <Modal title="Nastavit rozpočty kategorií (Kč)" onClose={onClose} maxWidth={580}>
      {groups.map(g => {
        const cats = categories.filter(c => c.kind === g.kind);
        if (cats.length === 0) return null;
        return (
          <div key={g.kind} style={{ marginBottom: 16 }}>
            <div style={styles.groupLabel}>{g.label}</div>
            {cats.map(cat => (
              <div key={cat.id} style={styles.budgetRow}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: cat.color }} />
                  <span style={{ fontWeight: 500 }}>{cat.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input type="number" step="1000" style={{ ...styles.input, width: 160, textAlign: 'right' }}
                    value={form[cat.id] || 0} onChange={e => setForm({ ...form, [cat.id]: parseFloat(e.target.value) || 0 })} />
                  <span style={{ color: '#64748b', fontSize: 13 }}>Kč</span>
                </div>
              </div>
            ))}
          </div>
        );
      })}
      <div style={styles.totalPreview}>Celkem: <strong>{fmt(total)}</strong></div>
      <div style={styles.modalActions}>
        <button style={styles.secondaryBtn} onClick={onClose}>Zrušit</button>
        <button style={styles.primaryBtn} onClick={() => onSave(form)}>Uložit rozpočty</button>
      </div>
    </Modal>
  );
}

function CategoryModal({ categories, onSave, onClose }) {
  const [list, setList] = useState(categories);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const addCat = (kind) => setList([...list, { id: uid('cat'), name: 'Nová kategorie', color: PALETTE[list.length % PALETTE.length], kind }]);
  const update = (id, patch) => setList(list.map(c => c.id === id ? { ...c, ...patch } : c));
  const remove = (id) => { setList(list.filter(c => c.id !== id)); setConfirmDeleteId(null); };
  const groups = [
    { kind: 'material', label: 'Materiál', icon: <Package size={14} /> },
    { kind: 'labor', label: 'Práce a subdodavatelé', icon: <Wrench size={14} /> },
    { kind: 'commission', label: 'Provize a řízení', icon: <Briefcase size={14} /> },
  ];
  return (
    <Modal title="Správa kategorií" onClose={onClose} maxWidth={680}>
      {groups.map(g => (
        <div key={g.kind} style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={styles.groupLabel}>{g.icon} {g.label}</div>
            <button style={styles.sortBtn} onClick={() => addCat(g.kind)}><Plus size={12} /> Přidat</button>
          </div>
          {list.filter(c => c.kind === g.kind).map(cat => (
            <div key={cat.id} style={styles.catRow}>
              <input type="color" value={cat.color} onChange={e => update(cat.id, { color: e.target.value })} style={styles.colorInput} />
              <input style={{ ...styles.input, flex: 1 }} value={cat.name} onChange={e => update(cat.id, { name: e.target.value })} />
              <select style={{ ...styles.input, width: 140 }} value={cat.kind} onChange={e => update(cat.id, { kind: e.target.value })}>
                <option value="material">Materiál</option><option value="labor">Práce</option><option value="commission">Provize</option>
              </select>
              {confirmDeleteId === cat.id ? (
                <div style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: '#dc2626', fontWeight: 600 }}>Opravdu?</span>
                  <button
                    onClick={() => remove(cat.id)}
                    style={{ ...styles.iconBtn, color: '#dc2626', background: '#fee2e2', border: '1px solid #fca5a5' }}
                    title="Potvrdit smazání"
                  ><Trash2 size={14} /></button>
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    style={{ ...styles.iconBtn, color: '#64748b' }}
                    title="Zrušit"
                  ><X size={14} /></button>
                </div>
              ) : (
                <button style={styles.iconBtn} onClick={() => setConfirmDeleteId(cat.id)}><Trash2 size={14} /></button>
              )}
            </div>
          ))}
        </div>
      ))}
      <div style={styles.modalActions}>
        <button style={styles.secondaryBtn} onClick={onClose}>Zrušit</button>
        <button style={styles.primaryBtn} onClick={() => onSave(list.filter(c => c.name.trim()))}>Uložit</button>
      </div>
    </Modal>
  );
}

function SupplierModal({ suppliers, readOnly, onSave, onClose }) {
  const [list, setList] = useState(suppliers);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const addSupplier = () => setList([...list, {
    id: uid('sup'), name: '', paymentTermsDays: 14, depositPercent: 0,
    balanceTrigger: 'order', defaultCurrency: 'CZK', contact: '', notes: '',
  }]);
  const update = (id, patch) => setList(list.map(s => s.id === id ? { ...s, ...patch } : s));
  const remove = (id) => { setList(list.filter(s => s.id !== id)); setConfirmDeleteId(null); };
  const submit = () => {
    onSave(list.filter(s => s.name.trim()).map(s => ({
      ...s, name: s.name.trim(),
      paymentTermsDays: s.paymentTermsDays === '' || s.paymentTermsDays == null ? null : parseInt(s.paymentTermsDays, 10),
      depositPercent: s.depositPercent === '' || s.depositPercent == null ? 0 : Math.max(0, Math.min(100, parseFloat(s.depositPercent) || 0)),
      balanceTrigger: s.balanceTrigger || 'order',
    })));
  };
  return (
    <Modal title={readOnly ? "Dodavatelé (jen čtení)" : "Dodavatelé a platební podmínky"} onClose={onClose} maxWidth={920}>
      {!readOnly && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
          <button style={styles.sortBtn} onClick={addSupplier}><Plus size={12} /> Přidat dodavatele</button>
        </div>
      )}
      {list.length === 0 ? (
        <div style={{ padding: 30, textAlign: 'center', color: '#94a3b8', border: '1px dashed #cbd5e1', borderRadius: 8 }}>Zatím žádní dodavatelé.</div>
      ) : (
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'auto' }}>
          <table style={{ ...styles.table, fontSize: 12, minWidth: 820 }}>
            <thead><tr>
              <th style={{ ...styles.th, padding: '9px 8px' }}>Název {!readOnly && '*'}</th>
              <th style={{ ...styles.th, padding: '9px 8px', width: 90 }}>Záloha %</th>
              <th style={{ ...styles.th, padding: '9px 8px', width: 90 }}>Splatnost (dnů)</th>
              <th style={{ ...styles.th, padding: '9px 8px', width: 130 }}>Splatnost od</th>
              <th style={{ ...styles.th, padding: '9px 8px', width: 80 }}>Měna</th>
              <th style={{ ...styles.th, padding: '9px 8px' }}>Kontakt</th>
              {!readOnly && <th style={{ ...styles.th, padding: '9px 8px', width: 110 }}></th>}
            </tr></thead>
            <tbody>
              {list.map(s => (
                <tr key={s.id} style={styles.tr}>
                  <td style={{ ...styles.td, padding: 5 }}><input style={styles.input} value={s.name} onChange={e => update(s.id, { name: e.target.value })} disabled={readOnly} /></td>
                  <td style={{ ...styles.td, padding: 5 }}>
                    <input type="number" min="0" max="100" step="5" style={{ ...styles.input, textAlign: 'right' }}
                      value={s.depositPercent ?? 0} onChange={e => update(s.id, { depositPercent: e.target.value })} disabled={readOnly} />
                  </td>
                  <td style={{ ...styles.td, padding: 5 }}>
                    <input type="number" min="0" step="1" style={{ ...styles.input, textAlign: 'right' }}
                      value={s.paymentTermsDays ?? ''} onChange={e => update(s.id, { paymentTermsDays: e.target.value === '' ? '' : parseInt(e.target.value, 10) })} disabled={readOnly} />
                  </td>
                  <td style={{ ...styles.td, padding: 5 }}>
                    <select style={styles.input} value={s.balanceTrigger || 'order'} onChange={e => update(s.id, { balanceTrigger: e.target.value })} disabled={readOnly}>
                      <option value="order">Data objednávky</option><option value="delivered">Data dodání</option>
                    </select>
                  </td>
                  <td style={{ ...styles.td, padding: 5 }}>
                    <select style={styles.input} value={s.defaultCurrency || 'CZK'} onChange={e => update(s.id, { defaultCurrency: e.target.value })} disabled={readOnly}>
                      <option value="CZK">CZK</option><option value="EUR">EUR</option>
                    </select>
                  </td>
                  <td style={{ ...styles.td, padding: 5 }}><input style={styles.input} value={s.contact || ''} onChange={e => update(s.id, { contact: e.target.value })} disabled={readOnly} /></td>
                  {!readOnly && (
                    <td style={{ ...styles.td, padding: 5, textAlign: 'center' }}>
                      {confirmDeleteId === s.id ? (
                        <div style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
                          <button
                            onClick={() => remove(s.id)}
                            style={{ ...styles.iconBtn, color: '#dc2626', background: '#fee2e2', border: '1px solid #fca5a5' }}
                            title="Potvrdit smazání"
                          ><Trash2 size={14} /></button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            style={{ ...styles.iconBtn, color: '#64748b' }}
                            title="Zrušit"
                          ><X size={14} /></button>
                        </div>
                      ) : (
                        <button
                          style={styles.iconBtn}
                          onClick={() => setConfirmDeleteId(s.id)}
                          title="Smazat dodavatele"
                        ><Trash2 size={14} /></button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div style={styles.modalActions}>
        <button style={styles.secondaryBtn} onClick={onClose}>{readOnly ? 'Zavřít' : 'Zrušit'}</button>
        {!readOnly && <button style={styles.primaryBtn} onClick={submit}>Uložit</button>}
      </div>
    </Modal>
  );
}

function CatalogModal({ catalog, suppliers, readOnly, onSave, onClose, onOpenSuppliers }) {
  const [list, setList] = useState(catalog);
  const [expanded, setExpanded] = useState(() => suppliers[0] ? new Set([suppliers[0].id]) : new Set());

  const bySupplier = useMemo(() => {
    const map = new Map();
    suppliers.forEach(s => map.set(s.id, { supplier: s, items: [] }));
    list.forEach(c => { if (map.has(c.supplierId)) map.get(c.supplierId).items.push(c); });
    return Array.from(map.values());
  }, [list, suppliers]);

  const addItem = (supplierId) => {
    const sup = suppliers.find(s => s.id === supplierId);
    setList([...list, { id: uid('cat'), supplierId, name: '', unit: 'pcs', unitPrice: 0, currency: sup?.defaultCurrency || 'CZK' }]);
    setExpanded(s => new Set([...s, supplierId]));
  };
  const update = (id, patch) => setList(list.map(c => c.id === id ? { ...c, ...patch } : c));
  const remove = (id) => setList(list.filter(c => c.id !== id));
  const toggleGroup = (sid) => { const next = new Set(expanded); if (next.has(sid)) next.delete(sid); else next.add(sid); setExpanded(next); };
  const submit = () => onSave(list.filter(c => c.name.trim() && c.supplierId).map(c => ({
    ...c, name: c.name.trim(), unit: (c.unit || 'pcs').trim(),
    unitPrice: parseFloat(c.unitPrice) || 0, currency: c.currency || 'CZK',
  })));

  if (suppliers.length === 0) {
    return (
      <Modal title="Katalog" onClose={onClose} maxWidth={500}>
        <div style={{ padding: 24, textAlign: 'center', color: '#64748b' }}>
          <p>Nejprve potřebujete alespoň jednoho dodavatele.</p>
          <button style={styles.primaryBtn} onClick={onOpenSuppliers}><Users size={15} /> Otevřít dodavatele</button>
        </div>
        <div style={styles.modalActions}><button style={styles.secondaryBtn} onClick={onClose}>Zavřít</button></div>
      </Modal>
    );
  }

  return (
    <Modal title="Katalog materiálu dodavatele" onClose={onClose} maxWidth={860}>
      <p style={{ color: '#64748b', fontSize: 14, margin: '0 0 12px' }}>
        Reusable item cards per supplier. Editing the price here updates linked items on all projects automatically.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {bySupplier.map(({ supplier, items }) => {
          const isOpen = expanded.has(supplier.id);
          return (
            <div key={supplier.id} style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: isOpen ? '#f8fafc' : '#fff' }} onClick={() => toggleGroup(supplier.id)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  <span style={{ fontWeight: 700 }}>{supplier.name}</span>
                  <span style={{ fontSize: 12, color: '#64748b' }}>{items.length} item{items.length !== 1 ? 's' : ''}</span>
                </div>
                <button style={styles.sortBtn} onClick={(e) => { e.stopPropagation(); addItem(supplier.id); }} disabled={readOnly} hidden={readOnly}><Plus size={11} /> Přidat</button>
              </div>
              {isOpen && (
                <div style={{ padding: '4px 0', borderTop: '1px solid #e2e8f0' }}>
                  {items.length === 0 ? (
                    <div style={{ padding: 14, fontSize: 13, color: '#94a3b8', textAlign: 'center' }}>Zatím žádné katalogové položky.</div>
                  ) : (
                    <table style={{ ...styles.table, fontSize: 13 }}>
                      <thead><tr>
                        <th style={{ ...styles.th, padding: '8px 10px' }}>Název {!readOnly && '*'}</th>
                        <th style={{ ...styles.th, padding: '8px 10px', width: 110 }}>Jednotka</th>
                        <th style={{ ...styles.th, padding: '8px 10px', width: 130, textAlign: 'right' }}>Jednotková cena {!readOnly && '*'}</th>
                        <th style={{ ...styles.th, padding: '8px 10px', width: 80 }}>Měna</th>
                        {!readOnly && <th style={{ ...styles.th, padding: '8px 10px', width: 40 }}></th>}
                      </tr></thead>
                      <tbody>
                        {items.map(c => (
                          <tr key={c.id} style={styles.tr}>
                            <td style={{ ...styles.td, padding: 5 }}><input style={styles.input} value={c.name} onChange={e => update(c.id, { name: e.target.value })} disabled={readOnly} /></td>
                            <td style={{ ...styles.td, padding: 5 }}>
                              <select style={styles.input} value={c.unit || 'pcs'} onChange={e => update(c.id, { unit: e.target.value })} disabled={readOnly}>
                                <option value="pcs">pcs</option><option value="m">m</option><option value="m²">m²</option>
                                <option value="kg">kg</option><option value="set">set</option><option value="pack">pack</option>
                                <option value="hr">hr</option><option value="day">day</option><option value="lump">lump</option>
                              </select>
                            </td>
                            <td style={{ ...styles.td, padding: 5 }}>
                              <input type="number" step="0.01" style={{ ...styles.input, textAlign: 'right' }} value={c.unitPrice} onChange={e => update(c.id, { unitPrice: e.target.value })} disabled={readOnly} />
                            </td>
                            <td style={{ ...styles.td, padding: 5 }}>
                              <select style={styles.input} value={c.currency || 'CZK'} onChange={e => update(c.id, { currency: e.target.value })} disabled={readOnly}>
                                <option value="CZK">CZK</option><option value="EUR">EUR</option>
                              </select>
                            </td>
                            {!readOnly && <td style={{ ...styles.td, padding: 5, textAlign: 'center' }}><button style={styles.iconBtn} onClick={() => remove(c.id)}><Trash2 size={14} /></button></td>}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={styles.modalActions}>
        <button style={styles.secondaryBtn} onClick={onClose}>{readOnly ? 'Zavřít' : 'Zrušit'}</button>
        {!readOnly && <button style={styles.primaryBtn} onClick={submit}>Uložit katalog</button>}
      </div>
    </Modal>
  );
}

// ==========================================================================
// PDF storage — IndexedDB (localStorage má limit ~5 MB, IndexedDB ~50–500 MB)
// ==========================================================================

const PDF_DB_NAME = 'fve-planner-pdfs';
const PDF_DB_VERSION = 1;
const PDF_STORE_NAME = 'pdfs';

function openPdfDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(PDF_DB_NAME, PDF_DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(PDF_STORE_NAME)) {
        db.createObjectStore(PDF_STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

async function savePdfToDb(id, filename, base64) {
  const db = await openPdfDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([PDF_STORE_NAME], 'readwrite');
    const store = tx.objectStore(PDF_STORE_NAME);
    const req = store.put({ id, filename, base64, savedAt: new Date().toISOString() });
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// Vytvořit hezký název souboru pro PDF přílohu: [dodavatel]_[cislo].pdf
// Sanitizace: nahradit diakritiku a znaky nepovolené v názvech souborů
function buildFilename(att) {
  const sanitize = (s) => (s || '')
    .toString()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // diakritika
    .replace(/[<>:"/\\|?*]+/g, '')                     // zakázané znaky ve Windows/Unix
    .replace(/\s+/g, '_')                              // mezery → _
    .replace(/[^A-Za-z0-9_\-\.]/g, '')                 // jen ASCII alfanum + _-.
    .replace(/_+/g, '_')                               // duplicitní _
    .replace(/^_|_$/g, '');                            // trim _
  const supplier = sanitize(att.supplierName);
  const order = sanitize(att.orderNumber);
  let name;
  if (supplier && order)      name = `${supplier}_${order}`;
  else if (supplier)          name = supplier;
  else if (order)             name = order;
  else if (att.filename)      name = att.filename.replace(/\.pdf$/i, '');
  else                        name = 'faktura';
  return `${name}.pdf`;
}

async function getPdfFromDb(id) {
  const db = await openPdfDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([PDF_STORE_NAME], 'readonly');
    const store = tx.objectStore(PDF_STORE_NAME);
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function deletePdfFromDb(id) {
  const db = await openPdfDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([PDF_STORE_NAME], 'readwrite');
    const store = tx.objectStore(PDF_STORE_NAME);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// Otevřít PDF v novém tabu (blob URL)
async function openPdfInNewTab(id) {
  const record = await getPdfFromDb(id);
  if (!record) throw new Error('PDF nenalezeno v databázi');
  // base64 → blob
  const bytes = Uint8Array.from(atob(record.base64), c => c.charCodeAt(0));
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  // Použít <a> místo window.open aby fungovalo i s blokátory pop-upů
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Vyčistit URL po 60 s (po otevření je již držen prohlížečem)
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

// File → base64 (bez data URL prefixu)
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      // Odstraníme "data:application/pdf;base64,"
      const commaIdx = result.indexOf(',');
      resolve(commaIdx >= 0 ? result.slice(commaIdx + 1) : result);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// ==========================================================================
// Claude API — extrakce položek z PDF faktury / objednávky
// ==========================================================================

async function extractPdfWithClaude(pdfBase64, apiKey, model = 'claude-sonnet-4-5', categoriesHint = []) {
  if (!apiKey) throw new Error('Není nastaven Anthropic API klíč. Doplňte ho v Nastavení.');

  const categoriesGuide = categoriesHint.length > 0
    ? `\n\nDoporučené kategorie (přiřaď každé položce jednu z nich podle jejího názvu, jinak nech prázdné):\n${categoriesHint.map(c => `- ${c.id}: ${c.name}`).join('\n')}`
    : '';

  const prompt = `Jsi asistent pro extrakci dat z českých fakturačních dokumentů (faktury, objednávky, nabídky) v oblasti fotovoltaiky.

Prostuduj přiložený PDF dokument a extrahuj VŠECHNY položky materiálu / služeb.

Vrať POUZE validní JSON (žádný komentář, žádné \`\`\` bloky) v tomto formátu:
{
  "supplier": "název dodavatele",
  "supplierIco": "IČO dodavatele nebo prázdné",
  "orderNumber": "číslo faktury/objednávky",
  "issueDate": "datum vystavení ISO YYYY-MM-DD nebo prázdné",
  "dueDate": "datum splatnosti ISO YYYY-MM-DD nebo prázdné",
  "currency": "CZK nebo EUR",
  "items": [
    {
      "name": "název položky",
      "quantity": číslo (množství),
      "unit": "jednotka (ks, m, kg, ...)",
      "unitPrice": číslo (jednotková cena BEZ DPH),
      "notes": "volitelná poznámka",
      "category": "id kategorie z nabídnutého seznamu, nebo prázdné"
    }
  ],
  "totalWithoutVat": číslo (celkem bez DPH),
  "vatRate": číslo (sazba DPH, obvykle 0, 12 nebo 21),
  "totalWithVat": číslo (celkem s DPH)
}

Pravidla:
- Ceny bez DPH (aplikace přidává DPH sama v cash flow)
- Pokud PDF obsahuje cenu s DPH i bez DPH, vezmi cenu BEZ DPH
- Množství přesně jak je uvedeno v dokumentu (např. 22 ks kabelu = 22, ne délka)
- Vynech řádky "Celkem", "Součet", "Doprava zdarma" pokud nejsou samostatnými položkami
- Poznámky (např. rozměry, barva) dej do "notes"${categoriesGuide}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: pdfBase64,
            },
          },
          { type: 'text', text: prompt },
        ],
      }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    let errMsg = `Chyba Anthropic API (${response.status})`;
    try {
      const errJson = JSON.parse(errText);
      errMsg += `: ${errJson.error?.message || errText}`;
    } catch { errMsg += `: ${errText}`; }
    throw new Error(errMsg);
  }

  const data = await response.json();
  const textBlock = data.content?.find(b => b.type === 'text');
  if (!textBlock) throw new Error('Odpověď API neobsahuje text.');

  // Robustně vytáhnout JSON (pro případ, že Claude vrátí i markdown)
  let jsonText = textBlock.text.trim();
  jsonText = jsonText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '');
  const firstBrace = jsonText.indexOf('{');
  const lastBrace = jsonText.lastIndexOf('}');
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    jsonText = jsonText.slice(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(jsonText);
  } catch (e) {
    throw new Error('Odpověď AI se nepodařilo naparsovat jako JSON. Text: ' + textBlock.text.slice(0, 200));
  }
}

// ==========================================================================
// Export Skladu do Excelu (.xlsx) — dva listy: Přehled kusů + Pohyby
// ==========================================================================

async function exportStockToExcel({ stockItems, stockMovements, locations, categories, projects, suppliers }) {
  if (!stockItems || stockItems.length === 0) {
    alert('Sklad je prázdný — není co exportovat.');
    return;
  }
  try {
    const XLSX = await loadXLSX();
    const today = new Date().toLocaleDateString('cs-CZ');
    const todayStr = todayISO();

    const findName = (arr, id) => arr.find(x => x.id === id)?.name || '';
    const findProject = (id) => {
      const p = projects.find(x => x.id === id);
      return p ? (p.client ? `${p.name} · ${p.client}` : p.name) : '';
    };

    // ========== LIST 1: Přehled kusů ==========
    const itemsRows = [
      ['Přehled skladu — Electree Solar'],
      [`Vygenerováno: ${today}`],
      [`Celkem kusů: ${stockItems.length} · dostupných: ${stockItems.filter(s => s.status !== 'consumed').length} · spotřebováno: ${stockItems.filter(s => s.status === 'consumed').length}`],
      [],
    ];

    // Hlavička
    itemsRows.push([
      'Stav', 'Položka', 'Kategorie', 'Sériové číslo', 'Lokace',
      'Zdrojový projekt', 'Cílový projekt', 'Objednávka', 'Dodavatel',
      'Nákupní cena (Kč)', 'Naskladněno', 'Záruka do', 'Poznámka',
    ]);

    stockItems.forEach(s => {
      const cat = categories.find(c => c.id === s.category);
      const loc = locations.find(l => l.id === s.locationId);
      const sup = s.supplierId ? suppliers.find(x => x.id === s.supplierId) : null;
      const warrantyDays = s.warrantyUntil ? daysBetween(s.warrantyUntil, todayStr) : null;
      let statusLabel;
      if (s.status === 'consumed') statusLabel = 'Spotřebováno';
      else if (warrantyDays !== null && warrantyDays < 0) statusLabel = 'Prošlá záruka';
      else if (warrantyDays !== null && warrantyDays <= 90) statusLabel = 'Záruka končí';
      else statusLabel = 'Dostupné';

      itemsRows.push([
        statusLabel,
        s.name || '',
        cat?.name || '',
        s.serialNumber || '',
        loc?.name || '',
        findProject(s.sourceProjectId),
        findProject(s.consumedToProjectId),
        s.orderNumber || '',
        sup?.name || s.supplierName || '',
        parseFloat(s.purchasePriceCZK) || 0,
        s.receivedDate || '',
        s.warrantyUntil || '',
        s.notes || '',
      ]);
    });

    const itemsSheet = XLSX.utils.aoa_to_sheet(itemsRows);
    // Šířky sloupců
    itemsSheet['!cols'] = [
      { wch: 14 }, // Stav
      { wch: 32 }, // Položka
      { wch: 16 }, // Kategorie
      { wch: 18 }, // S/N
      { wch: 20 }, // Lokace
      { wch: 26 }, // Zdroj proj
      { wch: 26 }, // Cíl proj
      { wch: 16 }, // Obj
      { wch: 22 }, // Dodavatel
      { wch: 14 }, // Cena
      { wch: 12 }, // Naskladněno
      { wch: 12 }, // Záruka
      { wch: 24 }, // Poznámka
    ];

    // ========== LIST 2: Pohyby ==========
    const movementsRows = [
      ['Pohyby skladu — Electree Solar'],
      [`Vygenerováno: ${today}`],
      [`Celkem pohybů: ${stockMovements?.length || 0}`],
      [],
    ];

    movementsRows.push([
      'Datum', 'Typ', 'Položka', 'Kategorie', 'Množství', 'Částka (Kč)',
      'Z lokace', 'Do lokace', 'Projekt', 'Uživatel', 'Poznámka',
    ]);

    const typeLabels = {
      receive: 'Naskladnění',
      transfer: 'Přesun',
      consume: 'Spotřeba',
      adjustment: 'Úprava',
      return: 'Vrácení',
      delete: 'Smazání',
    };

    // Seřadit pohyby sestupně dle data
    const sortedMovements = [...(stockMovements || [])].sort((a, b) =>
      (b.date || '').localeCompare(a.date || '')
    );

    sortedMovements.forEach(m => {
      // Najít položku (může být již smazaná)
      const item = stockItems.find(s => s.id === m.stockItemId);
      const cat = item ? categories.find(c => c.id === item.category) : null;
      const fromLoc = m.fromLocationId ? findName(locations, m.fromLocationId) : '';
      const toLoc = m.toLocationId ? findName(locations, m.toLocationId) : '';
      const proj = m.projectId ? findProject(m.projectId) : '';
      const amount = m.amountCZK != null ? m.amountCZK : (item ? parseFloat(item.purchasePriceCZK) || 0 : 0);

      movementsRows.push([
        m.date || '',
        typeLabels[m.type] || m.type,
        item?.name || m.itemName || '(smazaná položka)',
        cat?.name || '',
        m.quantity || 1,
        amount || '',
        fromLoc,
        toLoc,
        proj,
        m.user || '',
        m.notes || '',
      ]);
    });

    const movementsSheet = XLSX.utils.aoa_to_sheet(movementsRows);
    movementsSheet['!cols'] = [
      { wch: 12 }, // Datum
      { wch: 14 }, // Typ
      { wch: 32 }, // Položka
      { wch: 16 }, // Kategorie
      { wch: 10 }, // Množství
      { wch: 14 }, // Částka
      { wch: 20 }, // Z lokace
      { wch: 20 }, // Do lokace
      { wch: 26 }, // Projekt
      { wch: 16 }, // Uživatel
      { wch: 24 }, // Poznámka
    ];

    // ========== Sestavit workbook ==========
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, itemsSheet, 'Přehled kusů');
    XLSX.utils.book_append_sheet(wb, movementsSheet, 'Pohyby');

    XLSX.writeFile(wb, `Sklad_Electree_${todayStr}.xlsx`);
  } catch (e) {
    console.error(e);
    alert('Chyba při exportu skladu do Excelu: ' + (e.message || e));
  }
}

// Lazy loader pro JSZip — načte se z CDN při prvním použití
let _jszipPromise = null;
function loadJSZip() {
  if (typeof window !== 'undefined' && window.JSZip) return Promise.resolve(window.JSZip);
  if (_jszipPromise) return _jszipPromise;
  _jszipPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-jszip-loader]');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.JSZip));
      existing.addEventListener('error', () => reject(new Error('Nepodařilo se načíst JSZip knihovnu z CDN.')));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    script.async = true;
    script.dataset.jszipLoader = '1';
    script.onload = () => {
      if (window.JSZip) resolve(window.JSZip);
      else reject(new Error('JSZip načteno, ale window.JSZip není dostupné.'));
    };
    script.onerror = () => reject(new Error('Nepodařilo se načíst JSZip knihovnu z CDN.'));
    document.head.appendChild(script);
  });
  return _jszipPromise;
}

// Lazy loader pro SheetJS (xlsx) — načte UMD bundle z CDN při prvním použití.
// Funguje v artifact prostředí i na Vercelu (jako fallback k npm import).
let _xlsxPromise = null;
function loadXLSX() {
  if (typeof window !== 'undefined' && window.XLSX) return Promise.resolve(window.XLSX);
  if (_xlsxPromise) return _xlsxPromise;
  _xlsxPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-xlsx-loader]');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.XLSX));
      existing.addEventListener('error', () => reject(new Error('Nepodařilo se načíst SheetJS knihovnu z CDN.')));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
    script.async = true;
    script.dataset.xlsxLoader = '1';
    script.onload = () => {
      if (window.XLSX) resolve(window.XLSX);
      else reject(new Error('SheetJS načteno, ale window.XLSX není dostupné.'));
    };
    script.onerror = () => reject(new Error('Nepodařilo se načíst SheetJS knihovnu z CDN.'));
    document.head.appendChild(script);
  });
  return _xlsxPromise;
}

// ==========================================================================
// Fuzzy match — algoritmus pro párování položek z importu s nákupním seznamem
// ==========================================================================

function fuzzyMatchScore(importRow, planItem, sameSupplier) {
  let score = 0;
  const reasons = [];

  // 1) Shoda názvu (40%)
  const importName = normalizeForSearch(importRow.name || '');
  const planName = normalizeForSearch(planItem.name || '');
  if (importName && planName) {
    if (importName === planName) {
      score += 40;
      reasons.push('název přesně');
    } else if (importName.includes(planName) || planName.includes(importName)) {
      score += 30;
      reasons.push('název obsahuje');
    } else {
      // Tokenized match - alespoň jedno významné slovo (>3 znaky)
      const importTokens = importName.split(/\s+/).filter(t => t.length > 3);
      const planTokens = planName.split(/\s+/).filter(t => t.length > 3);
      const common = importTokens.filter(t => planTokens.some(p => p.includes(t) || t.includes(p)));
      if (common.length > 0) {
        const ratio = common.length / Math.max(importTokens.length, planTokens.length);
        const gained = Math.round(20 * ratio);
        score += gained;
        if (gained >= 10) reasons.push('podobný název');
      }
    }
  }

  // 2) Shoda množství (20%)
  const importQty = parseFloat(importRow.quantity) || 0;
  const planQty = parseFloat(planItem.quantity) || 0;
  if (importQty > 0 && planQty > 0) {
    if (importQty === planQty) {
      score += 20;
      reasons.push('stejné množství');
    } else {
      const ratio = Math.min(importQty, planQty) / Math.max(importQty, planQty);
      if (ratio >= 0.95) { score += 18; reasons.push('téměř stejné množství'); }
      else if (ratio >= 0.8) { score += 10; reasons.push('podobné množství'); }
      else if (ratio >= 0.5) { score += 4; }
    }
  }

  // 3) Shoda ceny (15%)
  const importPrice = parseFloat(importRow.unitPrice) || 0;
  const planPrice = parseFloat(planItem.unitPrice) || 0;
  if (importPrice > 0 && planPrice > 0) {
    const ratio = Math.min(importPrice, planPrice) / Math.max(importPrice, planPrice);
    if (ratio >= 0.95) { score += 15; reasons.push('téměř stejná cena'); }
    else if (ratio >= 0.85) { score += 10; reasons.push('podobná cena'); }
    else if (ratio >= 0.7) { score += 5; }
  }

  // 4) Shoda kategorie (15%)
  if (importRow.category && planItem.category && importRow.category === planItem.category) {
    score += 15;
    reasons.push('stejná kategorie');
  }

  // 5) Stejný dodavatel (10%)
  if (sameSupplier) {
    score += 10;
    reasons.push('stejný dodavatel');
  }

  return { score: Math.min(100, score), reasons };
}

function suggestMatches(importRow, planItems, supplierId) {
  // Vrací top 3 nejlepších návrhů pro tento řádek z importu
  const scored = planItems
    .filter(p => (p.status || 'planned') === 'planned')  // jen plánované, nikoli již objednané
    .map(p => {
      const sameSupplier = supplierId && p.supplierId === supplierId;
      const { score, reasons } = fuzzyMatchScore(importRow, p, sameSupplier);
      return { planItem: p, score, reasons };
    })
    .filter(x => x.score >= 30)  // ignoruj naprostý mismatch
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  return scored;
}

// ==========================================================================
// Automatická detekce kategorie podle názvu položky
// (používá se při importu z Excelu/CSV do projektu)
// ==========================================================================

function guessCategoryByName(itemName, categories) {
  if (!itemName || !categories || categories.length === 0) return '';
  const n = normalizeForSearch(itemName);
  if (!n) return categories[0]?.id || '';

  // POŘADÍ JE DŮLEŽITÉ — specifičtější patterny napřed.
  // "FVE" a "Solax" jsou výrobci/zkratky, neimplikují kategorii samy o sobě,
  // proto je řešíme až mezi posledními.
  const patterns = [
    // Práce — speciální klíčová slova
    { regex: /montazn[ií]\s*pr[áa]c|kompletn[ií]\s*montaz|instalacn[ií]\s*pr[áa]c|^pr[áa]ce\b/i, cat: 'labor' },

    // Subdodavatelé a služby
    { regex: /projekt\w*\s*dokumentac|revizn|žadost|zadost|distribuc|sop\s|ppp|stavebn[ií]\s*povolen[ií]/i, cat: 'subcontractor' },

    // Doprava → ostatní materiál
    { regex: /^doprava\b|preprav|manipulac/i, cat: 'other_material' },

    // Wallbox a nabíječky → ostatní
    { regex: /wallbox|nabij[ée]/i, cat: 'other_material' },

    // Monitoring a chytré řízení
    { regex: /monitor|chytr[éy]\s*r[ií]zen|chytr[éy]\s*regulac|nord|gsm|wifi|emanager|optimaliz/i, cat: 'monitoring' },

    // Konstrukce — dříve než "panel"
    { regex: /konstrukc|nosn[áa]\s*soust|rail|montaz(ni)?\s*system/i, cat: 'mounting' },

    // Baterie / úložiště — důležité dát před invertery (může být "Baterie Solax")
    { regex: /baterie|uloz|battery|accum|akumul/i, cat: 'batteries' },

    // Elektroinstalace — rozvaděče, jističe, SPD, odpojovače
    { regex: /rozvad|jistic|svodic|prepet|spd\b|rss\b|stop\s*tlac|odpoj/i, cat: 'electrical' },

    // Kabely
    { regex: /kabel|kabelaz|trasy|elektro\s*trasy/i, cat: 'cables' },

    // Měniče — "střídač", "měnič", "invertor"
    { regex: /stridac|stř[ií]dac|menic|m[ěe]nic|invert|hybridn[ií]\s*menic|x3-hyb|x1-hyb/i, cat: 'inverters' },

    // Panely — obecnější, dáváme až sem
    { regex: /^panely?\b|fv\s*panely|fotov(oltaick|oltai)/i, cat: 'panels' },

    // Provize
    { regex: /provize|prodejn[ií]\s*provize/i, cat: 'commission' },
  ];

  for (const p of patterns) {
    if (p.regex.test(n) && categories.find(c => c.id === p.cat)) return p.cat;
  }
  // Fallback: první materiálová kategorie (ne první v seznamu - ta může být cokoliv)
  return categories.find(c => c.kind === 'material')?.id || categories[0]?.id || '';
}

function ImportModal({ categories, suppliers, onImport, onClose }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null); // [{ category, name, supplier, quantity, unit, unitPrice, currency, plannedOrderDate, plannedDeliveryDate, notes, _rowKey }]
  const [sourceType, setSourceType] = useState(null); // 'csv' | 'xlsx'
  const [bulkSupplier, setBulkSupplier] = useState(''); // společný dodavatel pro vše
  // Výchozí datum objednávky: dnes + 21 dní
  const [bulkOrderDate, setBulkOrderDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 21);
    return d.toISOString().slice(0, 10);
  });
  const [bulkDeliveryDate, setBulkDeliveryDate] = useState('');

  const template = 'category,name,supplier,quantity,unit,unitPrice,currency,plannedOrderDate,plannedDeliveryDate,notes\nFV Panely,JA Solar 450W,SolarShop,24,pcs,2450,CZK,2026-05-10,2026-05-20,Bifacial';

  // ===== CSV parsing =====
  const parseCSV = () => {
    setError(''); setPreview(null); setSourceType('csv');
    try {
      const lines = text.trim().split(/\r?\n/);
      if (lines.length < 2) throw new Error('Vyžaduje hlavičku + datový řádek.');
      const header = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase());
      const required = ['category', 'name', 'quantity', 'unitprice'];
      for (const r of required) if (!header.includes(r)) throw new Error(`Chybí sloupec: ${r}`);
      const idx = (col) => header.indexOf(col);
      const items = [];
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const row = parseCSVLine(lines[i]);
        const catName = (row[idx('category')] || '').trim();
        const cat = categories.find(c => c.name.toLowerCase() === catName.toLowerCase() || c.id === catName);
        const itemName = (row[idx('name')] || '').trim();
        // Pokud sloupec category v CSV chybí nebo má neznámou hodnotu, zkusíme uhodnout z názvu
        const resolvedCategoryId = cat?.id || guessCategoryByName(itemName, categories);
        const supName = idx('supplier') >= 0 ? (row[idx('supplier')] || '').trim() : '';
        const matchedSup = supName ? suppliers.find(s => s.name.toLowerCase() === supName.toLowerCase()) : null;
        const currency = (row[idx('currency')] || 'CZK').trim().toUpperCase();
        const plannedOrder = idx('plannedorderdate') >= 0 ? (row[idx('plannedorderdate')] || '').trim() :
                             idx('purchasedate') >= 0 ? (row[idx('purchasedate')] || '').trim() : '';
        const plannedDelivery = idx('planneddeliverydate') >= 0 ? (row[idx('planneddeliverydate')] || '').trim() : '';
        items.push({
          _rowKey: `r${i}`,
          category: resolvedCategoryId,
          name: itemName,
          supplier: matchedSup ? '' : supName, supplierId: matchedSup?.id || '',
          quantity: parseFloat(row[idx('quantity')]) || 0,
          unit: idx('unit') >= 0 ? (row[idx('unit')] || 'pcs').trim() : 'pcs',
          unitPrice: parseFloat(row[idx('unitprice')]) || 0,
          currency: ['CZK', 'EUR'].includes(currency) ? currency : 'CZK',
          plannedOrderDate: plannedOrder,
          plannedDeliveryDate: plannedDelivery,
          purchaseDate: '', paymentDueDate: '', deliveredDate: '', invoicedDate: '',
          status: 'planned', catalogId: '', orderNumber: '',
          notes: idx('notes') >= 0 ? (row[idx('notes')] || '').trim() : '',
        });
      }
      // Auto-vyplnit výchozí datum objednávky (dnes + 21 dní), pokud položka nemá vlastní
      const withDefaults = items.map(it => ({
        ...it,
        plannedOrderDate: it.plannedOrderDate || bulkOrderDate,
      }));
      setPreview(withDefaults);
    } catch (e) { setError(e.message); }
  };

  // ===== XLSX parsing (Electree CRM format) =====
  const parseXLSX = async (file) => {
    setError(''); setPreview(null); setSourceType('xlsx');
    try {
      const XLSX = await loadXLSX();
      const arrayBuffer = await file.arrayBuffer();
      const wb = XLSX.read(arrayBuffer, { type: 'array' });
      // Najít sheet — typicky "Obchodní případ"
      const sheetName = wb.SheetNames.find(n => /obchod/i.test(n)) || wb.SheetNames[0];
      const ws = wb.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '', raw: false });

      // Najít začátek tabulky produktů — řádek "PRODUKTY"
      let headerRowIdx = -1;
      for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].map(c => String(c || '').trim().toLowerCase());
        if (cells.includes('produkty')) { headerRowIdx = i + 1; break; }
        // Alternativně: hledat řádek s "Kód" + "Název" + "Cena"
        if (cells.includes('kód') && cells.some(c => c.includes('název')) && cells.some(c => c.includes('cena'))) {
          headerRowIdx = i;
          break;
        }
      }
      if (headerRowIdx === -1) {
        throw new Error('Nenalezena tabulka produktů. Excel musí obsahovat sekci "PRODUKTY" nebo hlavičku "Kód / Název / Cena".');
      }

      // Header řádek (po "PRODUKTY" je další řádek hlavička)
      const headerRow = rows[headerRowIdx].map(c => String(c || '').trim().toLowerCase());
      const findCol = (...keywords) => {
        for (const kw of keywords) {
          const i = headerRow.findIndex(h => h.includes(kw));
          if (i >= 0) return i;
        }
        return -1;
      };
      const colKod = findCol('kód');
      const colNazev = findCol('název', 'nazev');
      // Cena (Kč) v Electree CRM = JEDNOTKOVÁ PRODEJNÍ cena — pro naše účely ji nepoužíváme
      const colCenaProdejni = findCol('cena (kč)', 'cena (czk)');
      // Sloupec F má hlavičku "Množství" — bereme přímo hodnotu z tohoto sloupce.
      const colMnozstvi = findCol('množství', 'mnozstvi');
      // Sloupec K = Náklady (Kč) — CELKOVÁ nákladová cena pro daný řádek
      // Jednotková nákladová cena = Náklady / Množství
      const colNakladyCelkem = findCol('náklady', 'naklady');

      if (colNazev === -1) {
        throw new Error(`Nenalezen sloupec "Název". Hlavička: ${headerRow.join(' | ')}`);
      }
      if (colMnozstvi === -1) {
        throw new Error(`Nenalezen sloupec "Množství". Hlavička: ${headerRow.join(' | ')}`);
      }
      if (colNakladyCelkem === -1) {
        throw new Error(`Nenalezen sloupec "Náklady (Kč)". Hlavička: ${headerRow.join(' | ')}`);
      }

      const items = [];
      for (let i = headerRowIdx + 1; i < rows.length; i++) {
        const row = rows[i];
        const nazev = String(row[colNazev] || '').trim();
        if (!nazev) continue;
        // Skip footer rows
        if (/cena celkem|celková sleva|konečná cena|předpokládan|nabíd|objednávk/i.test(nazev)) break;

        const parseNum = (v) => parseFloat(String(v || '').replace(/[^\d.,-]/g, '').replace(',', '.')) || 0;
        const mnozstvi = parseNum(row[colMnozstvi]) || 1;
        const nakladyCelkem = parseNum(row[colNakladyCelkem]);
        // Jednotková nákladová cena = celkové náklady / množství
        const jednotkovaNakladovaCena = mnozstvi > 0 ? nakladyCelkem / mnozstvi : 0;
        const kod = colKod >= 0 ? String(row[colKod] || '').trim() : '';
        // Pomocná info pro poznámku
        const cenaProdejni = colCenaProdejni >= 0 ? parseNum(row[colCenaProdejni]) : 0;
        const noteParts = [];
        if (kod) noteParts.push(`Kód: ${kod}`);
        if (cenaProdejni > 0) noteParts.push(`Prodejní cena: ${Math.round(cenaProdejni).toLocaleString('cs-CZ')} Kč/ks`);

        items.push({
          _rowKey: `xr${i}`,
          category: guessCategoryByName(nazev, categories),
          name: nazev,
          supplier: '', supplierId: '',
          quantity: mnozstvi,
          unit: 'pcs',
          unitPrice: jednotkovaNakladovaCena,
          currency: 'CZK',
          plannedOrderDate: '', plannedDeliveryDate: '',
          purchaseDate: '', paymentDueDate: '', deliveredDate: '', invoicedDate: '',
          status: 'planned', catalogId: '', orderNumber: '',
          notes: noteParts.join(' · '),
        });
      }
      if (items.length === 0) throw new Error('Tabulka produktů je prázdná.');
      // Auto-vyplnit výchozí datum objednávky (dnes + 21 dní), pokud položka nemá vlastní
      const withDefaults = items.map(it => ({
        ...it,
        plannedOrderDate: it.plannedOrderDate || bulkOrderDate,
      }));
      setPreview(withDefaults);
      // Zobrazit info text v textarea pro orientaci
      const itemsBezNakladu = items.filter(it => it.unitPrice === 0).length;
      const warnNoNaklady = itemsBezNakladu > 0 ? ` ⚠ ${itemsBezNakladu} položek bez nákupní ceny — doplňte ručně.` : '';
      setText(`Načteno z Excelu (${sheetName}): ${items.length} položek.${warnNoNaklady}`);
    } catch (e) {
      setError('Chyba při načítání Excelu: ' + e.message);
    }
  };

  // ===== File handler — auto-detect CSV vs XLSX =====
  const handleFile = (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    const ext = f.name.toLowerCase().split('.').pop();
    if (ext === 'xlsx' || ext === 'xls' || ext === 'xlsm') {
      parseXLSX(f);
    } else {
      // CSV nebo jiný textový soubor
      const r = new FileReader();
      r.onload = () => { setText(String(r.result || '')); setSourceType('csv'); };
      r.readAsText(f);
    }
  };

  // ===== Bulk apply pro XLSX preview =====
  const applyBulkSupplier = () => {
    if (!preview) return;
    const sup = suppliers.find(s => s.id === bulkSupplier);
    setPreview(preview.map(p => ({ ...p, supplierId: sup?.id || '', supplier: sup?.id ? '' : (sup?.name || '') })));
  };
  const applyBulkOrderDate = () => {
    if (!preview || !bulkOrderDate) return;
    setPreview(preview.map(p => ({ ...p, plannedOrderDate: bulkOrderDate })));
  };
  const applyBulkDeliveryDate = () => {
    if (!preview || !bulkDeliveryDate) return;
    setPreview(preview.map(p => ({ ...p, plannedDeliveryDate: bulkDeliveryDate })));
  };
  const updateRow = (rowKey, patch) => {
    setPreview(preview.map(p => p._rowKey === rowKey ? { ...p, ...patch } : p));
  };
  const removeRow = (rowKey) => {
    setPreview(preview.filter(p => p._rowKey !== rowKey));
  };

  // ===== Submit — odstranit _rowKey =====
  const doImport = () => {
    if (!preview) return;
    const cleaned = preview.map(({ _rowKey, ...rest }) => rest);
    onImport(cleaned);
  };

  return (
    <Modal title="Import položek" onClose={onClose} maxWidth={1100}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <label style={{ ...styles.secondaryBtn, cursor: 'pointer' }}>
          <Upload size={14} /> Vybrat soubor (CSV / XLSX)
          <input type="file" accept=".csv,.xlsx,.xls,.xlsm" onChange={handleFile} style={{ display: 'none' }} />
        </label>
        <button style={styles.sortBtn} onClick={() => { setText(template); setSourceType('csv'); }}>Načíst CSV šablonu</button>
        <span style={{ fontSize: 12, color: '#64748b' }}>Podporováno: CSV (viz šablona) a XLSX z Electree CRM</span>
      </div>

      {/* CSV editor — jen pokud sourceType === 'csv' */}
      {sourceType === 'csv' && (
        <>
          <textarea style={{ ...styles.input, fontFamily: 'monospace', fontSize: 12, minHeight: 140, resize: 'vertical' }}
            value={text} onChange={e => setText(e.target.value)} placeholder="Vložte CSV obsah nebo načtěte šablonu..." />
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button style={styles.secondaryBtn} onClick={parseCSV}>Zpracovat a zobrazit náhled</button>
          </div>
        </>
      )}

      {/* XLSX info */}
      {sourceType === 'xlsx' && text && (
        <div style={{ padding: 10, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, fontSize: 13, color: '#166534' }}>
          ✓ {text}
        </div>
      )}

      {error && (
        <div style={{ marginTop: 12, padding: 10, background: '#fef2f2', color: '#dc2626', borderRadius: 6, fontSize: 13 }}>
          {error}
        </div>
      )}

      {preview && preview.length > 0 && (
        <>
          {/* Bulk apply panel — primárně pro XLSX, ale funguje i pro CSV */}
          <div style={{
            marginTop: 14, padding: 12, background: '#f8fafc',
            border: '1px solid #e2e8f0', borderRadius: 8,
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Hromadné nastavení (volitelně)
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ minWidth: 180 }}>
                <label style={{ ...styles.label, fontSize: 11 }}>Dodavatel pro všechny</label>
                <div style={{ display: 'flex', gap: 4 }}>
                  <select style={{ ...styles.input, flex: 1 }} value={bulkSupplier} onChange={e => setBulkSupplier(e.target.value)}>
                    <option value="">— vyberte —</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  <button style={styles.sortBtn} onClick={applyBulkSupplier} disabled={!bulkSupplier}>Použít</button>
                </div>
              </div>
              <div style={{ minWidth: 180 }}>
                <label style={{ ...styles.label, fontSize: 11 }}>Datum plánované objednávky</label>
                <div style={{ display: 'flex', gap: 4 }}>
                  <input type="date" style={{ ...styles.input, flex: 1 }} value={bulkOrderDate} onChange={e => setBulkOrderDate(e.target.value)} />
                  <button style={styles.sortBtn} onClick={applyBulkOrderDate} disabled={!bulkOrderDate}>Použít</button>
                </div>
              </div>
              <div style={{ minWidth: 180 }}>
                <label style={{ ...styles.label, fontSize: 11 }}>Datum plánované dodávky</label>
                <div style={{ display: 'flex', gap: 4 }}>
                  <input type="date" style={{ ...styles.input, flex: 1 }} value={bulkDeliveryDate} onChange={e => setBulkDeliveryDate(e.target.value)} />
                  <button style={styles.sortBtn} onClick={applyBulkDeliveryDate} disabled={!bulkDeliveryDate}>Použít</button>
                </div>
              </div>
            </div>
          </div>

          {/* Preview table — editovatelná */}
          <div style={{ marginTop: 12, fontSize: 13, color: '#475569', fontWeight: 600 }}>
            Náhled položek ({preview.length}) — můžete upravit kategorii, dodavatele a datumy:
          </div>
          <div style={{ marginTop: 8, maxHeight: 400, overflow: 'auto', border: '1px solid #e2e8f0', borderRadius: 8 }}>
            <table style={{ ...styles.table, fontSize: 12 }}>
              <thead style={{ position: 'sticky', top: 0, background: '#f8fafc', zIndex: 1 }}>
                <tr>
                  <th style={{ ...styles.th, padding: '8px 6px', minWidth: 120 }}>Kategorie</th>
                  <th style={{ ...styles.th, padding: '8px 6px', minWidth: 200 }}>Název</th>
                  <th style={{ ...styles.th, padding: '8px 6px', minWidth: 140 }}>Dodavatel</th>
                  <th style={{ ...styles.th, padding: '8px 6px', textAlign: 'right', width: 80 }}>Množ.</th>
                  <th style={{ ...styles.th, padding: '8px 6px', width: 70 }}>Jedn.</th>
                  <th style={{ ...styles.th, padding: '8px 6px', textAlign: 'right', width: 100 }}>Cena/ks</th>
                  <th style={{ ...styles.th, padding: '8px 6px', width: 70 }}>Měna</th>
                  <th style={{ ...styles.th, padding: '8px 6px', width: 36 }}></th>
                </tr>
              </thead>
              <tbody>
                {preview.map(p => (
                  <tr key={p._rowKey} style={styles.tr}>
                    <td style={{ ...styles.td, padding: 4 }}>
                      <select style={{ ...styles.input, fontSize: 11, padding: '4px 6px' }} value={p.category} onChange={e => updateRow(p._rowKey, { category: e.target.value })}>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </td>
                    <td style={{ ...styles.td, padding: 4 }}>
                      <input style={{ ...styles.input, fontSize: 11, padding: '4px 6px' }} value={p.name} onChange={e => updateRow(p._rowKey, { name: e.target.value })} />
                    </td>
                    <td style={{ ...styles.td, padding: 4 }}>
                      <select style={{ ...styles.input, fontSize: 11, padding: '4px 6px' }} value={p.supplierId} onChange={e => {
                        const sup = suppliers.find(s => s.id === e.target.value);
                        updateRow(p._rowKey, { supplierId: e.target.value, supplier: sup ? '' : p.supplier });
                      }}>
                        <option value="">— bez dodavatele —</option>
                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </td>
                    <td style={{ ...styles.td, padding: 4 }}>
                      <input type="number" step="0.01" style={{ ...styles.input, fontSize: 11, padding: '4px 6px', textAlign: 'right' }} value={p.quantity} onChange={e => updateRow(p._rowKey, { quantity: parseFloat(e.target.value) || 0 })} />
                    </td>
                    <td style={{ ...styles.td, padding: 4 }}>
                      <select style={{ ...styles.input, fontSize: 11, padding: '4px 6px' }} value={p.unit} onChange={e => updateRow(p._rowKey, { unit: e.target.value })}>
                        <option value="pcs">pcs</option><option value="m">m</option><option value="m²">m²</option>
                        <option value="kg">kg</option><option value="set">set</option><option value="pack">pack</option>
                        <option value="hr">hr</option><option value="day">day</option><option value="lump">lump</option>
                      </select>
                    </td>
                    <td style={{ ...styles.td, padding: 4 }}>
                      <input type="number" step="0.01" style={{ ...styles.input, fontSize: 11, padding: '4px 6px', textAlign: 'right' }} value={p.unitPrice} onChange={e => updateRow(p._rowKey, { unitPrice: parseFloat(e.target.value) || 0 })} />
                    </td>
                    <td style={{ ...styles.td, padding: 4 }}>
                      <select style={{ ...styles.input, fontSize: 11, padding: '4px 6px' }} value={p.currency} onChange={e => updateRow(p._rowKey, { currency: e.target.value })}>
                        <option value="CZK">CZK</option><option value="EUR">EUR</option>
                      </select>
                    </td>
                    <td style={{ ...styles.td, padding: 4, textAlign: 'center' }}>
                      <button style={styles.iconBtn} onClick={() => removeRow(p._rowKey)} title="Odebrat řádek"><Trash2 size={12} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: '#64748b' }}>
            Tip: Datumy můžete vyplnit hromadně panel výše, nebo až po importu v Nákupním seznamu.
          </div>
        </>
      )}

      <div style={styles.modalActions}>
        <button style={styles.secondaryBtn} onClick={onClose}>Zrušit</button>
        <button style={{ ...styles.primaryBtn, opacity: preview && preview.length > 0 ? 1 : 0.5, pointerEvents: preview && preview.length > 0 ? 'auto' : 'none' }}
          onClick={doImport}>Import {preview ? `(${preview.length})` : ''}</button>
      </div>
    </Modal>
  );
}

// ==========================================================================
// Utils
// ==========================================================================

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ==========================================================================
// PDFImportModal — import faktury / objednávky z PDF pomocí AI (Anthropic)
// ==========================================================================

// Auto-spárování AI položek z faktury s existujícími položkami objednávky
// Vrací pole { aiItem, orderItemId, action, similarityScore } (pro každou AI položku 1 záznam)
function autoMatchAIItemsToOrder(aiItems, orderItems) {
  // Jednoduchá metrika: procento společných slov mezi normalizovanými názvy
  const normalize = (s) => (s || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // diakritika
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim();

  const wordSet = (s) => new Set(normalize(s).split(/\s+/).filter(w => w.length >= 2));

  const similarity = (a, b) => {
    const wa = wordSet(a);
    const wb = wordSet(b);
    if (wa.size === 0 || wb.size === 0) return 0;
    const inter = [...wa].filter(w => wb.has(w)).length;
    return inter / Math.max(wa.size, wb.size);
  };

  const usedOrderItemIds = new Set();
  const matches = [];

  aiItems.forEach((aiItem) => {
    let bestScore = 0;
    let bestId = null;
    orderItems.forEach(oi => {
      if (usedOrderItemIds.has(oi.id)) return;
      const score = similarity(aiItem.name, oi.name);
      if (score > bestScore) { bestScore = score; bestId = oi.id; }
    });
    if (bestId && bestScore >= 0.3) {
      usedOrderItemIds.add(bestId);
      matches.push({ aiItem, orderItemId: bestId, action: 'overwrite', similarityScore: bestScore });
    } else {
      matches.push({ aiItem, orderItemId: null, action: 'add', similarityScore: 0 });
    }
  });

  return matches;
}

function PDFImportModal({ projects, categories, suppliers, settings, targetOrder, onImport, onClose }) {
  const isAttachMode = !!targetOrder;
  const [phase, setPhase] = useState('upload'); // upload | processing | preview
  const [error, setError] = useState('');
  const [loadingMsg, setLoadingMsg] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfBase64, setPdfBase64] = useState('');
  const [aiResult, setAiResult] = useState(null); // Extrahovaná data z AI

  // Metadata pro import (v attach módu částečně předvyplněné z targetOrder)
  const [projectId, setProjectId] = useState(
    isAttachMode ? targetOrder.rows[0]?.projectId : (projects[0]?.id || '')
  );
  const [supplierId, setSupplierId] = useState(isAttachMode ? (targetOrder.supplierId || '') : '');
  const [supplierFreeText, setSupplierFreeText] = useState(isAttachMode && !targetOrder.supplierId ? (targetOrder.supplierName || '') : '');
  const [orderNumber, setOrderNumber] = useState(isAttachMode ? (targetOrder.orderNumber || '') : '');
  const [issueDate, setIssueDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [currency, setCurrency] = useState('CZK');
  // Editovatelné položky (kopie z aiResult.items) - v create módu
  const [items, setItems] = useState([]);
  // Matching pro attach mode: [{ aiItem, orderItemId | null, action: 'overwrite'|'add'|'skip' }]
  const [attachMatches, setAttachMatches] = useState([]);

  const hasApiKey = !!settings?.anthropicApiKey;
  const model = settings?.anthropicModel || 'claude-sonnet-4-5';

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Prosím nahrajte PDF soubor.');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setError('PDF je příliš velké (max 15 MB).');
      return;
    }
    setError('');
    setPdfFile(file);
    setPhase('processing');
    setLoadingMsg('Načítám PDF...');
    try {
      const base64 = await fileToBase64(file);
      setPdfBase64(base64);
      setLoadingMsg(`Analyzuji PDF pomocí AI (${model})... To může trvat 10–30 s.`);
      const result = await extractPdfWithClaude(base64, settings.anthropicApiKey, model, categories);
      setAiResult(result);
      // Předvyplnit metadata
      setOrderNumber(result.orderNumber || '');
      setIssueDate(result.issueDate || '');
      setDueDate(result.dueDate || '');
      setCurrency(result.currency || 'CZK');
      // Najít dodavatele podle jména
      if (result.supplier) {
        const supMatch = suppliers.find(s => (s.name || '').toLowerCase() === result.supplier.toLowerCase());
        if (supMatch) {
          setSupplierId(supMatch.id);
          setSupplierFreeText('');
        } else {
          setSupplierId('');
          setSupplierFreeText(result.supplier);
        }
      }
      // Naplnit položky (create mode)
      const aiItems = (result.items || []).map(it => ({
        name: it.name || '',
        quantity: parseFloat(it.quantity) || 0,
        unit: it.unit || 'ks',
        unitPrice: parseFloat(it.unitPrice) || 0,
        category: it.category || '',
        notes: it.notes || '',
      }));
      setItems(aiItems);

      // V attach módu automaticky spárovat s existující objednávkou
      if (isAttachMode && targetOrder) {
        const orderItems = targetOrder.rows.map(r => r.item);
        const matches = autoMatchAIItemsToOrder(aiItems, orderItems);
        setAttachMatches(matches);
      }

      setPhase('preview');
    } catch (e) {
      console.error(e);
      setError(e.message || 'Neznámá chyba při zpracování PDF.');
      setPhase('upload');
    }
  };

  const updateItem = (idx, patch) => {
    setItems(items.map((it, i) => i === idx ? { ...it, ...patch } : it));
  };
  const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx));
  const addItem = () => setItems([...items, { name: '', quantity: 1, unit: 'ks', unitPrice: 0, category: '', notes: '' }]);

  const totalWithoutVat = useMemo(() =>
    items.reduce((s, it) => s + (parseFloat(it.quantity) || 0) * (parseFloat(it.unitPrice) || 0), 0)
  , [items]);

  const submit = async () => {
    if (!isAttachMode) {
      if (!projectId) { alert('Vyberte projekt, do kterého se položky přidají.'); return; }
      if (items.length === 0) { alert('Přidejte alespoň jednu položku.'); return; }
      if (items.some(i => !i.name.trim())) { alert('Všechny položky musí mít název.'); return; }
    } else {
      if (attachMatches.length === 0) { alert('Nemáte žádné položky k přiřazení.'); return; }
    }
    // Uložit PDF do IndexedDB
    const attachmentId = uid('pdf');
    try {
      await savePdfToDb(attachmentId, pdfFile.name, pdfBase64);
    } catch (e) {
      if (!window.confirm('Nepodařilo se uložit PDF do lokální databáze. Chcete přesto pokračovat (bez archivace PDF)?')) return;
    }
    onImport({
      mode: isAttachMode ? 'attach' : 'create',
      projectId,
      supplierId,
      supplierFreeText: supplierFreeText.trim(),
      orderNumber: orderNumber.trim(),
      issueDate,
      dueDate,
      currency,
      items,
      matches: isAttachMode ? attachMatches : undefined,
      attachment: {
        id: attachmentId,
        filename: pdfFile.name,
        importedAt: new Date().toISOString(),
        orderNumber: orderNumber.trim(),
        supplierName: supplierFreeText.trim() || suppliers.find(s => s.id === supplierId)?.name || '',
      },
    });
  };

  if (!hasApiKey) {
    return (
      <Modal title="Import PDF – chybí API klíč" onClose={onClose} maxWidth={520}>
        <div style={{ padding: 16, background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 8, marginBottom: 12 }}>
          <div style={{ fontWeight: 700, color: '#92400e', marginBottom: 6 }}>
            🔑 Není nastaven Anthropic API klíč
          </div>
          <div style={{ fontSize: 13, color: '#78350f' }}>
            Pro import PDF pomocí AI potřebujete API klíč od Anthropic. Získáte ho na <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer" style={{ color: '#78350f', fontWeight: 600 }}>console.anthropic.com</a>.
            Poté klíč vložte v <strong>Nastavení → Ostatní</strong> a zkuste to znovu.
          </div>
        </div>
        <div style={styles.modalActions}>
          <button style={styles.primaryBtn} onClick={onClose}>OK</button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title={isAttachMode ? `Přehrát objednávku #${targetOrder.orderNumber || '(bez čísla)'} daty z faktury` : 'Import faktury / objednávky z PDF'} onClose={onClose} maxWidth={880}>
      {error && (
        <div style={{ padding: 10, background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: 6, marginBottom: 12, fontSize: 13 }}>
          <strong>Chyba:</strong> {error}
        </div>
      )}

      {phase === 'upload' && (
        <div style={{ padding: 40, border: '2px dashed #cbd5e1', borderRadius: 8, textAlign: 'center' }}>
          <FileText size={40} style={{ color: '#94a3b8', marginBottom: 12 }} />
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Nahrajte PDF fakturu nebo objednávku</div>
          <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>
            Aplikace pošle PDF do Claude API ({model}) a vytáhne z něj strukturované položky.
            Cca 10–30 s. Náklady ~0.01–0.03 $ za dokument.
          </p>
          <input
            type="file"
            accept="application/pdf"
            onChange={e => handleFile(e.target.files?.[0])}
            style={{ display: 'none' }}
            id="pdf-import-input"
          />
          <label htmlFor="pdf-import-input" style={{ ...styles.primaryBtn, display: 'inline-flex', cursor: 'pointer' }}>
            <Upload size={14} /> Vybrat PDF...
          </label>
        </div>
      )}

      {phase === 'processing' && (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <div style={{
            width: 40, height: 40, border: '3px solid #c4ff3d', borderTopColor: '#0d3825', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#0d3825' }}>{loadingMsg}</div>
        </div>
      )}

      {phase === 'preview' && aiResult && (
        <>
          {isAttachMode ? (
            <>
              <div style={{ padding: 10, background: '#ede9fe', border: '1px solid #c4b5fd', borderRadius: 6, marginBottom: 12, fontSize: 12, color: '#5b21b6' }}>
                🎯 <strong>Režim „Přehrát daty z faktury"</strong> — přiřazujete fakturu k objednávce <strong>#{targetOrder.orderNumber || '(bez čísla)'}</strong> od dodavatele <strong>{targetOrder.supplierName}</strong>.<br/>
                Aplikace {attachMatches.filter(m => m.action === 'overwrite').length}× spárovala s existující položkou, {attachMatches.filter(m => m.action === 'add').length}× navrhla přidat novou.
              </div>

              {/* Údaje z faktury */}
              <div style={{ padding: 12, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, marginBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Údaje z faktury</div>
                <div style={styles.formRowGroup}>
                  <div style={{ flex: 1 }}>
                    <label style={styles.label}>Datum vystavení</label>
                    <input type="date" style={styles.input} value={issueDate} onChange={e => setIssueDate(e.target.value)} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={styles.label}>Splatnost</label>
                    <input type="date" style={styles.input} value={dueDate} onChange={e => setDueDate(e.target.value)} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={styles.label}>Měna</label>
                    <select style={styles.input} value={currency} onChange={e => setCurrency(e.target.value)}>
                      <option value="CZK">CZK</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Matching preview */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>
                  Porovnání položek ({attachMatches.length} z faktury)
                </div>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, overflow: 'auto', maxHeight: 400 }}>
                  <table style={{ ...styles.table, fontSize: 11 }}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Z faktury (AI)</th>
                        <th style={styles.th}>Akce</th>
                        <th style={styles.th}>Původní v objednávce</th>
                        <th style={styles.th}>Rozdíl</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attachMatches.map((m, idx) => {
                        const orderItem = m.orderItemId ? targetOrder.rows.find(r => r.item.id === m.orderItemId)?.item : null;
                        const aiTotal = (parseFloat(m.aiItem.quantity) || 0) * (parseFloat(m.aiItem.unitPrice) || 0);
                        const orderTotal = orderItem ? (parseFloat(orderItem.quantity) || 0) * (parseFloat(orderItem.unitPrice) || 0) : 0;
                        const diff = aiTotal - orderTotal;
                        return (
                          <tr key={idx} style={{
                            ...styles.tr,
                            background: m.action === 'skip' ? '#f8fafc' : (m.action === 'overwrite' ? '#fff' : '#fef3c7'),
                            opacity: m.action === 'skip' ? 0.5 : 1,
                          }}>
                            <td style={styles.td}>
                              <div style={{ fontWeight: 500 }}>{m.aiItem.name}</div>
                              <div style={{ fontSize: 10, color: '#64748b' }}>
                                {m.aiItem.quantity} {m.aiItem.unit} × {fmt(m.aiItem.unitPrice)} = <strong>{fmt(aiTotal)} {currency}</strong>
                              </div>
                            </td>
                            <td style={styles.td}>
                              <select
                                value={m.action}
                                onChange={e => setAttachMatches(attachMatches.map((am, i) => i === idx ? { ...am, action: e.target.value } : am))}
                                style={{ ...styles.input, padding: '3px 5px', fontSize: 11, width: 120 }}
                              >
                                <option value="overwrite">✓ Přehrát</option>
                                <option value="add">+ Přidat nové</option>
                                <option value="skip">⏭ Přeskočit</option>
                              </select>
                              {m.action === 'overwrite' && (
                                <select
                                  value={m.orderItemId || ''}
                                  onChange={e => setAttachMatches(attachMatches.map((am, i) => i === idx ? { ...am, orderItemId: e.target.value } : am))}
                                  style={{ ...styles.input, padding: '3px 5px', fontSize: 10, width: 120, marginTop: 3 }}
                                >
                                  <option value="">— Vyberte položku —</option>
                                  {targetOrder.rows.map(r => (
                                    <option key={r.item.id} value={r.item.id}>{r.item.name}</option>
                                  ))}
                                </select>
                              )}
                              {m.action === 'overwrite' && m.similarityScore > 0 && (
                                <div style={{ fontSize: 9, color: '#64748b', marginTop: 2 }}>
                                  Shoda: {Math.round(m.similarityScore * 100)}%
                                </div>
                              )}
                            </td>
                            <td style={styles.td}>
                              {orderItem ? (
                                <>
                                  <div style={{ fontWeight: 500 }}>{orderItem.name}</div>
                                  <div style={{ fontSize: 10, color: '#64748b' }}>
                                    {orderItem.quantity} {orderItem.unit} × {fmt(orderItem.unitPrice)} = <strong>{fmt(orderTotal)} {orderItem.currency}</strong>
                                  </div>
                                </>
                              ) : <span style={{ color: '#94a3b8', fontSize: 10 }}>—</span>}
                            </td>
                            <td style={styles.td}>
                              {m.action === 'overwrite' && orderItem ? (
                                <span style={{
                                  fontSize: 11, fontWeight: 600,
                                  color: Math.abs(diff) < 1 ? '#94a3b8' : (diff > 0 ? '#dc2626' : '#16a34a'),
                                }}>
                                  {diff > 0 ? '+' : ''}{fmt(diff)} {currency}
                                </span>
                              ) : m.action === 'add' ? (
                                <span style={{ fontSize: 10, color: '#92400e' }}>nová položka</span>
                              ) : (
                                <span style={{ color: '#cbd5e1' }}>—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div style={{ marginTop: 6, fontSize: 11, color: '#64748b' }}>
                  <strong>Přehrát</strong> = přepsat množství, cenu a měnu · nastavit vyfakturováno · přiložit PDF.
                  Název, jednotka, kategorie a projekt zůstávají.
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{ padding: 10, background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 6, marginBottom: 12, fontSize: 12, color: '#166534' }}>
                ✓ AI vytáhla <strong>{items.length}</strong> položek. Zkontrolujte hodnoty a případně upravte, než potvrdíte import.
              </div>

          {/* Metadata */}
          <div style={{ padding: 12, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Údaje z faktury</div>
            <div style={styles.formRowGroup}>
              <div style={{ flex: 2 }}>
                <label style={styles.label}>Projekt *</label>
                <select style={styles.input} value={projectId} onChange={e => setProjectId(e.target.value)}>
                  <option value="">— Vyberte projekt —</option>
                  {[...projects].sort((a, b) => {
                    // Sklad vždy první
                    if (a.isStockProject && !b.isStockProject) return -1;
                    if (!a.isStockProject && b.isStockProject) return 1;
                    return (a.name || '').localeCompare(b.name || '');
                  }).map(p => (
                    <option key={p.id} value={p.id}>
                      {p.isStockProject ? '🏭 ' : ''}{p.name}{p.client ? ` · ${p.client}` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 2 }}>
                <label style={styles.label}>Dodavatel</label>
                <select style={styles.input} value={supplierId} onChange={e => { setSupplierId(e.target.value); if (e.target.value) setSupplierFreeText(''); }}>
                  <option value="">— Nový (níže) —</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                {!supplierId && (
                  <input style={{ ...styles.input, marginTop: 4, fontSize: 12 }} value={supplierFreeText} onChange={e => setSupplierFreeText(e.target.value)} placeholder="Název dodavatele" />
                )}
              </div>
            </div>
            <div style={styles.formRowGroup}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Č. objednávky / faktury</label>
                <input style={styles.input} value={orderNumber} onChange={e => setOrderNumber(e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Datum vystavení</label>
                <input type="date" style={styles.input} value={issueDate} onChange={e => setIssueDate(e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Splatnost</label>
                <input type="date" style={styles.input} value={dueDate} onChange={e => setDueDate(e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Měna</label>
                <select style={styles.input} value={currency} onChange={e => setCurrency(e.target.value)}>
                  <option value="CZK">CZK</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
          </div>

          {/* Položky */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>Položky ({items.length})</div>
              <button style={styles.sortBtn} onClick={addItem}><Plus size={12} /> Přidat řádek</button>
            </div>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, overflow: 'auto', maxHeight: 350 }}>
              <table style={{ ...styles.table, fontSize: 11 }}>
                <thead>
                  <tr>
                    <th style={styles.th}>#</th>
                    <th style={styles.th}>Název</th>
                    <th style={styles.th}>Kategorie</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Množ.</th>
                    <th style={styles.th}>Jedn.</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Cena/ks</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Celkem</th>
                    <th style={styles.th}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, idx) => (
                    <tr key={idx} style={styles.tr}>
                      <td style={{ ...styles.td, color: '#94a3b8' }}>{idx + 1}</td>
                      <td style={styles.td}>
                        <input style={{ ...styles.input, padding: '3px 6px', fontSize: 11, minWidth: 200 }} value={it.name} onChange={e => updateItem(idx, { name: e.target.value })} />
                        {it.notes && <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{it.notes}</div>}
                      </td>
                      <td style={styles.td}>
                        <select style={{ ...styles.input, padding: '3px 6px', fontSize: 11 }} value={it.category} onChange={e => updateItem(idx, { category: e.target.value })}>
                          <option value="">—</option>
                          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </td>
                      <td style={styles.td}>
                        <input type="number" step="0.01" style={{ ...styles.input, padding: '3px 6px', fontSize: 11, width: 70, textAlign: 'right' }} value={it.quantity} onChange={e => updateItem(idx, { quantity: parseFloat(e.target.value) || 0 })} />
                      </td>
                      <td style={styles.td}>
                        <input style={{ ...styles.input, padding: '3px 6px', fontSize: 11, width: 50 }} value={it.unit} onChange={e => updateItem(idx, { unit: e.target.value })} />
                      </td>
                      <td style={styles.td}>
                        <input type="number" step="0.01" style={{ ...styles.input, padding: '3px 6px', fontSize: 11, width: 90, textAlign: 'right' }} value={it.unitPrice} onChange={e => updateItem(idx, { unitPrice: parseFloat(e.target.value) || 0 })} />
                      </td>
                      <td style={{ ...styles.td, textAlign: 'right', fontWeight: 600, color: '#0d3825' }}>
                        {fmt((parseFloat(it.quantity) || 0) * (parseFloat(it.unitPrice) || 0))} {currency}
                      </td>
                      <td style={styles.td}>
                        <button onClick={() => removeItem(idx)} style={{ ...styles.iconBtn, color: '#dc2626' }} title="Odebrat">
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: '#f8fafc', fontWeight: 700 }}>
                    <td colSpan={6} style={{ ...styles.td, textAlign: 'right' }}>Součet (bez DPH):</td>
                    <td style={{ ...styles.td, textAlign: 'right', color: '#0d3825' }}>{fmt(totalWithoutVat)} {currency}</td>
                    <td style={styles.td}></td>
                  </tr>
                  {aiResult.totalWithoutVat && Math.abs(aiResult.totalWithoutVat - totalWithoutVat) > 1 && (
                    <tr style={{ background: '#fef3c7', fontSize: 10 }}>
                      <td colSpan={8} style={{ ...styles.td, color: '#92400e' }}>
                        ⚠ AI zjistila celkem <strong>{fmt(aiResult.totalWithoutVat)} {currency}</strong> — rozdíl {fmt(Math.abs(aiResult.totalWithoutVat - totalWithoutVat))}. Zkontrolujte hodnoty.
                      </td>
                    </tr>
                  )}
                </tfoot>
              </table>
            </div>
          </div>
            </>
          )}

          <div style={styles.modalActions}>
            <button style={styles.secondaryBtn} onClick={onClose}>Zrušit</button>
            <button style={styles.primaryBtn} onClick={submit}>
              {isAttachMode ? (
                <>
                  <FileText size={14} /> Přehrát objednávku ({attachMatches.filter(m => m.action !== 'skip').length}× akce) + přiložit PDF
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} /> Importovat {items.length} položek + archivovat PDF
                </>
              )}
            </button>
          </div>
        </>
      )}

      {phase === 'upload' && (
        <div style={styles.modalActions}>
          <button style={styles.secondaryBtn} onClick={onClose}>Zrušit</button>
        </div>
      )}
    </Modal>
  );
}

// ==========================================================================
// ImportOrderModal — import objednávky z Excelu s párováním na nákupní seznam
// ==========================================================================

function ImportOrderModal({ projects, categories, suppliers, fxRate, onImport, onClose }) {
  // Fáze: upload -> mapping -> matching -> summary
  const [phase, setPhase] = useState('upload');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Surová data z Excelu
  const [rawRows, setRawRows] = useState(null); // array of arrays (první je hlavička)
  const [headers, setHeaders] = useState([]);
  const [previewRows, setPreviewRows] = useState([]);

  // Mapování sloupců
  const [colMap, setColMap] = useState({
    name: '', quantity: '', unit: '', unitPrice: '', currency: '', orderNumber: '', notes: '',
  });

  // Metadata objednávky
  const [orderMeta, setOrderMeta] = useState({
    orderNumber: '',
    supplierId: '',
    purchaseDate: todayISO(),
    defaultCurrency: 'CZK',
    defaultCategory: '',
  });

  // Spárované řádky: array of { importRow, planItemId, action: 'match'|'create'|'skip', targetProjectId, category }
  const [matches, setMatches] = useState([]);

  // ===== Step 1: Upload =====
  const handleFile = async (file) => {
    setError('');
    setLoading(true);
    try {
      const ext = (file.name.split('.').pop() || '').toLowerCase();
      let rows;
      if (ext === 'csv' || ext === 'tsv' || ext === 'txt') {
        const text = await file.text();
        const sep = ext === 'tsv' ? '\t' : (text.split('\n')[0].includes(';') ? ';' : ',');
        rows = text.trim().split(/\r?\n/).map(line => parseCSVLine(line, sep));
      } else {
        const XLSX = await loadXLSX();
        const arrayBuffer = await file.arrayBuffer();
        const wb = XLSX.read(arrayBuffer, { type: 'array' });
        const firstSheet = wb.Sheets[wb.SheetNames[0]];
        rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' });
      }
      if (!rows || rows.length < 2) {
        throw new Error('Soubor je prázdný nebo nemá žádné datové řádky.');
      }
      // Najít první řádek s "rozumnými" hlavičkami (text, ne jen čísla)
      let headerIdx = 0;
      for (let i = 0; i < Math.min(5, rows.length); i++) {
        const r = rows[i];
        const textCells = r.filter(c => typeof c === 'string' && c.trim().length > 0).length;
        const numericCells = r.filter(c => typeof c === 'number' || (typeof c === 'string' && /^-?\d+([.,]\d+)?$/.test(c.trim()))).length;
        if (textCells > numericCells && textCells >= 2) {
          headerIdx = i;
          break;
        }
      }
      const hdrs = rows[headerIdx].map(h => String(h || '').trim());
      const data = rows.slice(headerIdx + 1).filter(r => r.some(c => String(c || '').trim() !== ''));
      setHeaders(hdrs);
      setRawRows(data);
      setPreviewRows(data.slice(0, 5));

      // Heuristika pro automatické mapování
      const guess = guessColumnMapping(hdrs);
      setColMap(prev => ({ ...prev, ...guess }));

      setPhase('mapping');
    } catch (e) {
      setError('Chyba při čtení souboru: ' + (e?.message || 'neznámá chyba'));
    } finally {
      setLoading(false);
    }
  };

  // ===== Step 2: Parsování dat podle mapování =====
  const parsedRows = useMemo(() => {
    if (!rawRows || !colMap.name) return [];
    const idx = (col) => col ? headers.indexOf(col) : -1;
    const ni = idx(colMap.name);
    const qi = idx(colMap.quantity);
    const ui = idx(colMap.unit);
    const pi = idx(colMap.unitPrice);
    const ci = idx(colMap.currency);
    const oi = idx(colMap.orderNumber);
    const xi = idx(colMap.notes);

    return rawRows.map((r, rowIdx) => {
      const name = ni >= 0 ? String(r[ni] || '').trim() : '';
      const qtyRaw = qi >= 0 ? String(r[qi] || '').replace(',', '.').trim() : '1';
      const priceRaw = pi >= 0 ? String(r[pi] || '').replace(/\s/g, '').replace(',', '.').trim() : '0';
      const currency = ci >= 0 ? String(r[ci] || '').trim().toUpperCase() : '';
      return {
        _idx: rowIdx,
        name,
        quantity: parseFloat(qtyRaw) || 1,
        unit: ui >= 0 ? String(r[ui] || 'ks').trim() : 'ks',
        unitPrice: parseFloat(priceRaw) || 0,
        currency: ['CZK', 'EUR', 'USD'].includes(currency) ? currency : orderMeta.defaultCurrency,
        orderNumber: oi >= 0 ? String(r[oi] || '').trim() : '',
        notes: xi >= 0 ? String(r[xi] || '').trim() : '',
      };
    }).filter(r => r.name);
  }, [rawRows, headers, colMap, orderMeta.defaultCurrency]);

  // ===== Step 3: Auto-match po vstupu do matching fáze =====
  const enterMatchingPhase = () => {
    if (parsedRows.length === 0) {
      setError('Žádná použitelná data — zkontrolujte mapování sloupců.');
      return;
    }
    // Sesbírat všechny plánované položky napříč projekty
    const allPlanItems = [];
    projects.forEach(p => {
      (p.items || []).forEach(item => {
        if ((item.status || 'planned') === 'planned') {
          allPlanItems.push({ ...item, projectId: p.id, projectName: p.name });
        }
      });
    });

    // Pro každý řádek z importu najít nejlepší shody
    const initialMatches = parsedRows.map(row => {
      const enrichedRow = { ...row, category: orderMeta.defaultCategory };
      const suggestions = suggestMatches(enrichedRow, allPlanItems, orderMeta.supplierId);
      const best = suggestions[0];

      if (best && best.score >= 70) {
        return {
          importRow: enrichedRow,
          action: 'match',
          planItemId: best.planItem.id,
          planItem: best.planItem,
          targetProjectId: best.planItem.projectId,
          category: best.planItem.category || orderMeta.defaultCategory,
          score: best.score,
          matchReasons: best.reasons,
          suggestions,
        };
      } else if (best && best.score >= 40) {
        return {
          importRow: enrichedRow,
          action: 'review',
          planItemId: best.planItem.id,
          planItem: best.planItem,
          targetProjectId: best.planItem.projectId,
          category: best.planItem.category || orderMeta.defaultCategory,
          score: best.score,
          matchReasons: best.reasons,
          suggestions,
        };
      } else {
        return {
          importRow: enrichedRow,
          action: 'create',
          planItemId: null,
          planItem: null,
          targetProjectId: projects[0]?.id || '',
          category: orderMeta.defaultCategory,
          score: 0,
          matchReasons: [],
          suggestions,
        };
      }
    });

    setMatches(initialMatches);
    setError('');
    setPhase('matching');
  };

  const updateMatch = (idx, patch) => {
    setMatches(matches.map((m, i) => i === idx ? { ...m, ...patch } : m));
  };

  // ===== Step 4: Konečný import =====
  const performImport = () => {
    const result = {
      orderMeta,
      patches: [],   // existující položky k aktualizaci
      newItems: [],  // nové položky k vytvoření
      skipped: [],   // přeskočené řádky
    };

    matches.forEach(m => {
      const ir = m.importRow;
      const totalPriceCZK = m.importRow.currency === 'EUR' ? m.importRow.unitPrice * fxRate : m.importRow.unitPrice;

      if (m.action === 'skip') {
        result.skipped.push(ir);
        return;
      }
      if (m.action === 'match' || m.action === 'review') {
        if (!m.planItemId) return;
        result.patches.push({
          projectId: m.targetProjectId,
          itemId: m.planItemId,
          patch: {
            status: 'ordered',
            quantity: ir.quantity,
            unitPrice: ir.unitPrice,
            currency: ir.currency,
            purchaseDate: orderMeta.purchaseDate,
            orderNumber: orderMeta.orderNumber || ir.orderNumber || '',
            supplierId: orderMeta.supplierId || undefined,
            notes: ir.notes || m.planItem?.notes || '',
          },
        });
      } else if (m.action === 'create') {
        if (!m.targetProjectId) return;
        result.newItems.push({
          projectId: m.targetProjectId,
          item: {
            id: uid('item'),
            name: ir.name,
            quantity: ir.quantity,
            unit: ir.unit || 'ks',
            unitPrice: ir.unitPrice,
            currency: ir.currency,
            category: m.category || orderMeta.defaultCategory || categories[0]?.id,
            supplierId: orderMeta.supplierId || '',
            supplier: '',
            status: 'ordered',
            purchaseDate: orderMeta.purchaseDate,
            orderNumber: orderMeta.orderNumber || ir.orderNumber || '',
            notes: ir.notes || '',
            plannedOrderDate: '', plannedDeliveryDate: '',
            deliveredDate: '', invoicedDate: '', paymentDueDate: '',
            catalogId: '',
          },
        });
      }
    });

    onImport(result);
  };

  // ===== Statistiky pro UI =====
  const stats = useMemo(() => {
    const m = matches.filter(x => x.action === 'match').length;
    const r = matches.filter(x => x.action === 'review').length;
    const c = matches.filter(x => x.action === 'create').length;
    const s = matches.filter(x => x.action === 'skip').length;
    return { matched: m, review: r, create: c, skip: s };
  }, [matches]);

  // ===== Render =====
  return (
    <Modal title="Import objednávky z Excelu" onClose={onClose} maxWidth={1200}>
      {/* Progress bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: '1px solid #e2e8f0', paddingBottom: 8 }}>
        {[
          { id: 'upload', label: '1. Nahrání', done: phase !== 'upload' },
          { id: 'mapping', label: '2. Sloupce', done: ['matching', 'summary'].includes(phase) },
          { id: 'matching', label: '3. Párování', done: phase === 'summary' },
          { id: 'summary', label: '4. Souhrn', done: false },
        ].map((step, i, arr) => (
          <div key={step.id} style={{
            flex: 1, padding: '6px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600,
            background: phase === step.id ? '#0d3825' : (step.done ? '#bbf7d0' : '#f1f5f9'),
            color: phase === step.id ? '#fff' : (step.done ? '#166534' : '#94a3b8'),
            textAlign: 'center',
          }}>
            {step.done ? '✓ ' : ''}{step.label}
          </div>
        ))}
      </div>

      {error && (
        <div style={{ padding: 10, background: '#fee2e2', color: '#b91c1c', borderRadius: 6, marginBottom: 12, fontSize: 13 }}>
          ⚠ {error}
        </div>
      )}

      {phase === 'upload' && (
        <ImportOrderUpload onFile={handleFile} loading={loading} />
      )}

      {phase === 'mapping' && (
        <ImportOrderMapping
          headers={headers}
          previewRows={previewRows}
          colMap={colMap}
          setColMap={setColMap}
          orderMeta={orderMeta}
          setOrderMeta={setOrderMeta}
          suppliers={suppliers}
          categories={categories}
          parsedRowsCount={parsedRows.length}
          onBack={() => setPhase('upload')}
          onNext={enterMatchingPhase}
        />
      )}

      {phase === 'matching' && (
        <ImportOrderMatching
          matches={matches}
          updateMatch={updateMatch}
          projects={projects}
          categories={categories}
          orderMeta={orderMeta}
          fxRate={fxRate}
          stats={stats}
          onBack={() => setPhase('mapping')}
          onNext={() => setPhase('summary')}
        />
      )}

      {phase === 'summary' && (
        <ImportOrderSummary
          matches={matches}
          orderMeta={orderMeta}
          suppliers={suppliers}
          stats={stats}
          fxRate={fxRate}
          onBack={() => setPhase('matching')}
          onConfirm={performImport}
          onCancel={onClose}
        />
      )}
    </Modal>
  );
}

// ===== Helper: parse CSV line =====
function parseCSVLine(line, sep = ',') {
  const out = [];
  let cur = '';
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuote && line[i + 1] === '"') { cur += '"'; i++; }
      else inQuote = !inQuote;
    } else if (ch === sep && !inQuote) {
      out.push(cur); cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out.map(s => s.trim());
}

// ===== Helper: heuristika pro guessování sloupců =====
function guessColumnMapping(headers) {
  const map = { name: '', quantity: '', unit: '', unitPrice: '', currency: '', orderNumber: '', notes: '' };
  const patterns = {
    name: /^(n[aá]zev|polo[zž]ka|produkt|popis|item|name|description|zbo[zž][ií])/i,
    quantity: /^(po[čc]et|mno[zž]stv[ií]|ks|kus[uů]|quantity|qty|amount)$/i,
    unit: /^(jednotka|jedn|unit|mj|m\.j\.)$/i,
    unitPrice: /(cena\s*(za\s*)?(ks|kus|jednotk|bez\s*dph)|jednotkov.*cena|unit\s*price|price)/i,
    currency: /^(m[ěe]na|currency|cur)$/i,
    orderNumber: /(č[ií]slo\s*objedn[aá]vky|order\s*number|objednavka|order[\s_-]?no)/i,
    notes: /^(pozn[aá]mka|notes|note|coment[áa]\u0159|comment)/i,
  };
  headers.forEach(h => {
    Object.entries(patterns).forEach(([key, pattern]) => {
      if (!map[key] && pattern.test(h)) map[key] = h;
    });
  });
  return map;
}

// ===== Sub-component: Upload =====
function ImportOrderUpload({ onFile, loading }) {
  const fileRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  return (
    <div>
      <p style={{ color: '#64748b', fontSize: 14, margin: '0 0 14px' }}>
        Vyberte Excel (.xlsx, .xls) nebo CSV soubor s objednávkou od dodavatele. Aplikace vám pomůže
        spárovat řádky s plánovanými položkami v nákupním seznamu.
      </p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        style={{
          padding: 40, border: `2px dashed ${dragOver ? '#0d3825' : '#cbd5e1'}`,
          borderRadius: 12, textAlign: 'center', cursor: 'pointer',
          background: dragOver ? '#f0fdf4' : '#f8fafc',
          transition: 'all 0.15s ease',
        }}
      >
        <Upload size={36} style={{ color: dragOver ? '#0d3825' : '#94a3b8', marginBottom: 12 }} />
        <div style={{ fontSize: 15, fontWeight: 600, color: '#0d3825', marginBottom: 4 }}>
          {loading ? 'Načítám soubor...' : 'Klikněte nebo přetáhněte soubor'}
        </div>
        <div style={{ fontSize: 12, color: '#64748b' }}>Podporované formáty: .xlsx, .xls, .csv, .tsv</div>
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls,.csv,.tsv,.txt"
          style={{ display: 'none' }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ''; }}
        />
      </div>

      <div style={{ marginTop: 14, padding: 12, background: '#dbeafe', color: '#1e40af', borderRadius: 6, fontSize: 12 }}>
        💡 <strong>Tip:</strong> Aplikace zkusí automaticky rozpoznat sloupce (název, množství, cena...).
        V dalším kroku můžete mapování upravit ručně.
      </div>
    </div>
  );
}

// ===== Sub-component: Mapping =====
function ImportOrderMapping({ headers, previewRows, colMap, setColMap, orderMeta, setOrderMeta, suppliers, categories, parsedRowsCount, onBack, onNext }) {
  const colChoice = (key, label, required) => (
    <div>
      <label style={styles.label}>{label} {required && '*'}</label>
      <select style={styles.input} value={colMap[key] || ''} onChange={e => setColMap({ ...colMap, [key]: e.target.value })}>
        <option value="">— Ignorovat —</option>
        {headers.map(h => <option key={h} value={h}>{h}</option>)}
      </select>
    </div>
  );

  return (
    <div>
      <h3 style={{ margin: '0 0 8px', fontSize: 15 }}>Mapování sloupců</h3>
      <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 14px' }}>
        Vyberte, který sloupec v Excelu odpovídá kterému poli v aplikaci. Tučně označená pole jsou povinná.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, marginBottom: 16 }}>
        {colChoice('name', 'Název položky', true)}
        {colChoice('quantity', 'Množství', true)}
        {colChoice('unit', 'Jednotka', false)}
        {colChoice('unitPrice', 'Cena za kus', true)}
        {colChoice('currency', 'Měna (jinak default)', false)}
        {colChoice('orderNumber', 'Č. objednávky v řádku', false)}
        {colChoice('notes', 'Poznámka', false)}
      </div>

      {/* Náhled prvních řádků */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
          Náhled (prvních 5 řádků):
        </div>
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, overflow: 'auto', background: '#fff' }}>
          <table style={{ ...styles.table, fontSize: 11 }}>
            <thead>
              <tr>
                {headers.map((h, i) => {
                  const mapped = Object.entries(colMap).find(([_, v]) => v === h);
                  return (
                    <th key={i} style={{ ...styles.th, padding: '6px 8px', background: mapped ? '#dcfce7' : '#f8fafc' }}>
                      {h}
                      {mapped && (
                        <div style={{ fontSize: 9, color: '#166534', fontWeight: 600, marginTop: 2 }}>
                          → {mapped[0]}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {previewRows.map((r, i) => (
                <tr key={i} style={styles.tr}>
                  {headers.map((_, j) => (
                    <td key={j} style={{ ...styles.td, padding: '4px 8px', fontSize: 11 }}>{String(r[j] || '')}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <h3 style={{ margin: '14px 0 8px', fontSize: 15 }}>Metadata objednávky</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
        <div>
          <label style={styles.label}>Číslo objednávky</label>
          <input style={styles.input} value={orderMeta.orderNumber} onChange={e => setOrderMeta({ ...orderMeta, orderNumber: e.target.value })} placeholder="OBJ-2026-001" />
        </div>
        <div>
          <label style={styles.label}>Dodavatel *</label>
          <select style={styles.input} value={orderMeta.supplierId} onChange={e => setOrderMeta({ ...orderMeta, supplierId: e.target.value })}>
            <option value="">— Vyberte —</option>
            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label style={styles.label}>Datum nákupu *</label>
          <input type="date" style={styles.input} value={orderMeta.purchaseDate} onChange={e => setOrderMeta({ ...orderMeta, purchaseDate: e.target.value })} />
        </div>
        <div>
          <label style={styles.label}>Měna (default)</label>
          <select style={styles.input} value={orderMeta.defaultCurrency} onChange={e => setOrderMeta({ ...orderMeta, defaultCurrency: e.target.value })}>
            <option value="CZK">CZK</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
          </select>
        </div>
        <div>
          <label style={styles.label}>Kategorie (default)</label>
          <select style={styles.input} value={orderMeta.defaultCategory} onChange={e => setOrderMeta({ ...orderMeta, defaultCategory: e.target.value })}>
            <option value="">— Vyberte —</option>
            {categories.filter(c => c.kind === 'material').map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginTop: 14, padding: 10, background: '#f0fdf4', color: '#166534', borderRadius: 6, fontSize: 13 }}>
        Po nastavení mapování bude rozpoznáno <strong>{parsedRowsCount}</strong> řádků.
      </div>

      <div style={styles.modalActions}>
        <button style={styles.secondaryBtn} onClick={onBack}>← Zpět</button>
        <button
          style={{ ...styles.primaryBtn, opacity: (colMap.name && colMap.quantity && colMap.unitPrice && orderMeta.supplierId) ? 1 : 0.5 }}
          disabled={!colMap.name || !colMap.quantity || !colMap.unitPrice || !orderMeta.supplierId}
          onClick={onNext}
        >
          Pokračovat na párování →
        </button>
      </div>
    </div>
  );
}

// ===== Sub-component: Matching =====
function ImportOrderMatching({ matches, updateMatch, projects, categories, orderMeta, fxRate, stats, onBack, onNext }) {
  // Všechny plánované položky napříč projekty - pro plný výběr v dropdownu
  const allPlanItems = useMemo(() => {
    const out = [];
    projects.forEach(p => {
      (p.items || []).forEach(item => {
        if ((item.status || 'planned') === 'planned') {
          out.push({ ...item, projectId: p.id, projectName: p.name });
        }
      });
    });
    return out;
  }, [projects]);

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
        <StatBadge color="#10b981" label="Automaticky spárováno" count={stats.matched} />
        <StatBadge color="#f59e0b" label="Vyžaduje kontrolu" count={stats.review} />
        <StatBadge color="#3b82f6" label="Nová položka" count={stats.create} />
        <StatBadge color="#94a3b8" label="Přeskočeno" count={stats.skip} />
      </div>

      <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 14px' }}>
        Aplikace navrhla párování. Zelená = jistá shoda. Žlutá = vyžaduje kontrolu.
        Modrá = nová položka. Vlevo: <strong>položka z Excelu</strong>. Vpravo: <strong>navržená položka v nákupním seznamu</strong>.
        {allPlanItems.length === 0 && (
          <span style={{ display: 'block', marginTop: 6, color: '#f59e0b', fontWeight: 600 }}>
            ⚠ V nákupním seznamu nejsou žádné plánované položky — všechny řádky budou vytvořeny jako nové.
          </span>
        )}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '60vh', overflowY: 'auto' }}>
        {matches.map((m, idx) => (
          <ImportOrderMatchRow
            key={idx}
            match={m}
            idx={idx}
            updateMatch={updateMatch}
            projects={projects}
            categories={categories}
            fxRate={fxRate}
            allPlanItems={allPlanItems}
          />
        ))}
      </div>

      <div style={styles.modalActions}>
        <button style={styles.secondaryBtn} onClick={onBack}>← Zpět</button>
        <button style={styles.primaryBtn} onClick={onNext}>
          Pokračovat na souhrn →
        </button>
      </div>
    </div>
  );
}

function ImportOrderMatchRow({ match, idx, updateMatch, projects, categories, fxRate, allPlanItems }) {
  const ir = match.importRow;
  const lineTotal = ir.quantity * ir.unitPrice;
  const lineTotalCZK = ir.currency === 'EUR' ? lineTotal * fxRate : lineTotal;

  // Pro dropdown: seřazené plánované položky podle skóre shody s tímto řádkem
  // Vždy ukáže VŠECHNY plánované položky (i s nulovým skóre), seřazené nejlepší shoda nahoře
  const sortedPlanItems = useMemo(() => {
    if (!allPlanItems || allPlanItems.length === 0) return [];
    return [...allPlanItems]
      .map(pi => {
        const { score } = fuzzyMatchScore(ir, pi, false);
        return { planItem: pi, score };
      })
      .sort((a, b) => b.score - a.score);
  }, [allPlanItems, ir]);

  const colors = {
    match: { bg: '#f0fdf4', border: '#86efac', label: 'AUTO SPÁROVÁNO', labelColor: '#15803d' },
    review: { bg: '#fefce8', border: '#fde047', label: 'PROVĚŘIT', labelColor: '#a16207' },
    create: { bg: '#eff6ff', border: '#93c5fd', label: 'NOVÁ POLOŽKA', labelColor: '#1e40af' },
    skip: { bg: '#f1f5f9', border: '#cbd5e1', label: 'PŘESKOČIT', labelColor: '#64748b' },
  };
  const c = colors[match.action];

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 8, alignItems: 'stretch',
      padding: 10, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 8,
    }}>
      {/* Vlevo: data z Excelu */}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: c.labelColor, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
          {c.label} {match.score > 0 && `(${match.score}%)`}
        </div>
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{ir.name}</div>
        <div style={{ fontSize: 11, color: '#475569' }}>
          {ir.quantity} {ir.unit} × {fmt2(ir.unitPrice, ir.currency)} = <strong>{fmt(lineTotalCZK)}</strong>
        </div>
        {ir.notes && <div style={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic', marginTop: 2 }}>{ir.notes}</div>}
      </div>

      {/* Střed: šipka */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.labelColor }}>
        <ArrowRight size={20} />
      </div>

      {/* Vpravo: akce */}
      <div style={{ minWidth: 0 }}>
        <select
          style={{ ...styles.input, fontSize: 12, padding: '4px 8px', marginBottom: 6 }}
          value={match.action === 'review' ? 'match' : match.action}
          onChange={e => {
            const action = e.target.value;
            if (action === 'create') {
              updateMatch(idx, { action: 'create', planItemId: null, planItem: null });
            } else if (action === 'skip') {
              updateMatch(idx, { action: 'skip' });
            } else {
              // Přepnutí na "match" - vybrat aktuálně nejlepší shodu z VŠECH plánovaných položek
              const best = sortedPlanItems[0];
              updateMatch(idx, {
                action: 'match',
                planItemId: best?.planItem.id || null,
                planItem: best?.planItem || null,
                targetProjectId: best?.planItem.projectId || '',
                category: best?.planItem.category || match.category,
              });
            }
          }}
        >
          <option value="match" disabled={sortedPlanItems.length === 0}>
            → Spárovat s plánem{sortedPlanItems.length === 0 ? ' (žádné plánované položky)' : ''}
          </option>
          <option value="create">+ Vytvořit novou položku</option>
          <option value="skip">⊘ Přeskočit</option>
        </select>

        {(match.action === 'match' || match.action === 'review') && (
          <div>
            {sortedPlanItems.length > 0 ? (
              <>
                <select
                  style={{ ...styles.input, fontSize: 11, padding: '4px 8px' }}
                  value={match.planItemId || ''}
                  onChange={e => {
                    const found = sortedPlanItems.find(s => s.planItem.id === e.target.value);
                    if (found) {
                      updateMatch(idx, {
                        planItemId: found.planItem.id,
                        planItem: found.planItem,
                        targetProjectId: found.planItem.projectId,
                        category: found.planItem.category,
                      });
                    }
                  }}
                >
                  {!match.planItemId && <option value="">— Vyberte položku —</option>}
                  {sortedPlanItems.map(s => {
                    const scoreText = s.score >= 70 ? `[${s.score}% ✓]`
                      : s.score >= 40 ? `[${s.score}% ?]`
                      : s.score > 0 ? `[${s.score}%]`
                      : '';
                    return (
                      <option key={s.planItem.id} value={s.planItem.id}>
                        {scoreText} {s.planItem.name} · {s.planItem.projectName} · {s.planItem.quantity} {s.planItem.unit} × {fmt2(s.planItem.unitPrice || 0, s.planItem.currency || 'CZK')}
                      </option>
                    );
                  })}
                </select>
                <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>
                  ↑ {sortedPlanItems.length} {sortedPlanItems.length === 1 ? 'plánovaná položka' : sortedPlanItems.length < 5 ? 'plánované položky' : 'plánovaných položek'} v nákupním seznamu, seřazeno podle shody
                </div>
              </>
            ) : (
              <div style={{ fontSize: 11, color: '#dc2626', fontStyle: 'italic', padding: 6, background: '#fee2e2', borderRadius: 4 }}>
                ⚠ V nákupním seznamu nejsou žádné plánované položky.
                Změňte akci na „Vytvořit novou položku".
              </div>
            )}
            {match.matchReasons.length > 0 && (
              <div style={{ fontSize: 10, color: '#64748b', marginTop: 4, fontStyle: 'italic' }}>
                ✓ {match.matchReasons.join(', ')}
              </div>
            )}
            {match.planItem && (
              <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>
                <strong>Aktuální plán:</strong> {match.planItem.quantity} {match.planItem.unit} × {fmt2(match.planItem.unitPrice || 0, match.planItem.currency || 'CZK')}
                {(match.planItem.quantity !== ir.quantity || (match.planItem.unitPrice || 0).toFixed(2) !== ir.unitPrice.toFixed(2)) && (
                  <div style={{ fontSize: 10, color: '#f59e0b', marginTop: 2 }}>
                    ⚠ Po importu se přepíše skutečným údajem z faktury
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {match.action === 'create' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <select
              style={{ ...styles.input, fontSize: 11, padding: '4px 8px' }}
              value={match.targetProjectId || ''}
              onChange={e => updateMatch(idx, { targetProjectId: e.target.value })}
            >
              <option value="">— Vyberte projekt —</option>
              {projects.filter(p => (p.status || 'active') === 'active').map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <select
              style={{ ...styles.input, fontSize: 11, padding: '4px 8px' }}
              value={match.category || ''}
              onChange={e => updateMatch(idx, { category: e.target.value })}
            >
              <option value="">— Kategorie —</option>
              {categories.filter(c => c.kind === 'material').map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

function StatBadge({ color, label, count }) {
  return (
    <div style={{
      padding: '8px 12px', borderRadius: 8, background: '#fff',
      border: `1px solid ${color}`, fontSize: 12,
      display: 'inline-flex', alignItems: 'center', gap: 8,
    }}>
      <span style={{ fontSize: 16, fontWeight: 700, color }}>{count}</span>
      <span style={{ color: '#475569' }}>{label}</span>
    </div>
  );
}

// ===== Sub-component: Summary =====
function ImportOrderSummary({ matches, orderMeta, suppliers, stats, fxRate, onBack, onConfirm, onCancel }) {
  const supplier = suppliers.find(s => s.id === orderMeta.supplierId);
  const totalCZK = matches
    .filter(m => m.action !== 'skip')
    .reduce((sum, m) => {
      const ir = m.importRow;
      const t = ir.quantity * ir.unitPrice;
      return sum + (ir.currency === 'EUR' ? t * fxRate : t);
    }, 0);

  return (
    <div>
      <h3 style={{ margin: '0 0 12px', fontSize: 16 }}>Souhrn před importem</h3>

      <div style={{ padding: 14, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, marginBottom: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 14px', fontSize: 13 }}>
          <div style={{ color: '#64748b' }}>Číslo objednávky:</div>
          <div style={{ fontWeight: 600 }}>{orderMeta.orderNumber || '(bez čísla)'}</div>
          <div style={{ color: '#64748b' }}>Dodavatel:</div>
          <div style={{ fontWeight: 600 }}>{supplier?.name || '(nenastaveno)'}</div>
          <div style={{ color: '#64748b' }}>Datum nákupu:</div>
          <div style={{ fontWeight: 600 }}>{orderMeta.purchaseDate}</div>
          <div style={{ color: '#64748b' }}>Celková hodnota:</div>
          <div style={{ fontWeight: 700, color: '#0d3825', fontSize: 16 }}>{fmt(totalCZK)}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 14 }}>
        <SummaryCard label="Spárováno s plánem" value={String(stats.matched + stats.review)} accent="#10b981" />
        <SummaryCard label="Nových položek" value={String(stats.create)} accent="#3b82f6" />
        <SummaryCard label="Přeskočeno" value={String(stats.skip)} accent="#94a3b8" />
      </div>

      <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, padding: 12, background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 6 }}>
        <strong style={{ color: '#92400e' }}>Co se stane po potvrzení:</strong>
        <ul style={{ margin: '6px 0 0', paddingLeft: 20 }}>
          {stats.matched + stats.review > 0 && (
            <li><strong>{stats.matched + stats.review}</strong> položek v nákupním seznamu bude označeno jako objednané a jejich cena/množství budou aktualizovány skutečnými údaji</li>
          )}
          {stats.create > 0 && (
            <li><strong>{stats.create}</strong> nových položek bude vytvořeno v projektech (ihned se statusem „objednáno")</li>
          )}
          {stats.skip > 0 && (
            <li><strong>{stats.skip}</strong> řádků bude ignorováno</li>
          )}
          <li>Nebude smazána žádná existující data</li>
        </ul>
      </div>

      <div style={styles.modalActions}>
        <button style={styles.secondaryBtn} onClick={onBack}>← Zpět</button>
        <button style={styles.sortBtn} onClick={onCancel}>Zrušit</button>
        <button style={styles.primaryBtn} onClick={onConfirm}>
          <CheckCircle2 size={14} /> Potvrdit import
        </button>
      </div>
    </div>
  );
}

// ==========================================================================
// Styles
// ==========================================================================

const globalCSS = `
  * { box-sizing: border-box; }
  body { margin: 0; }
  input:focus, select:focus, textarea:focus { outline: 2px solid #c4ff3d; outline-offset: -1px; }
  button { cursor: pointer; font-family: inherit; }
  table { border-collapse: collapse; }
`;

const styles = {
  loadingScreen: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400, background: '#f8f7f1' },
  app: { fontFamily: '"IBM Plex Sans", -apple-system, sans-serif', minHeight: '100vh', background: '#f8f7f1', color: '#0d3825' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', background: '#0d3825', borderBottom: '1px solid #0d3825', flexWrap: 'wrap', gap: 12, color: '#fff' },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  logo: { width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  title: { margin: 0, fontSize: 19, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' },
  subtitle: { margin: '2px 0 0', fontSize: 12, color: 'rgba(255, 255, 255, 0.6)' },
  primaryBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 999, border: 'none', background: '#c4ff3d', color: '#0d3825', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' },
  secondaryBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 999, background: '#fff', color: '#0d3825', fontSize: 13, fontWeight: 500, border: '1px solid #cbd5e1', fontFamily: 'inherit' },
  secondaryBtnDark: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 999, background: 'rgba(255, 255, 255, 0.08)', color: '#fff', fontSize: 13, fontWeight: 500, border: '1px solid rgba(255, 255, 255, 0.15)', fontFamily: 'inherit' },
  navBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 999, background: 'transparent', color: 'rgba(255, 255, 255, 0.7)', fontSize: 13, fontWeight: 500, border: '1px solid transparent', fontFamily: 'inherit' },
  navBtnActive: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 999, background: '#c4ff3d', color: '#0d3825', fontSize: 13, fontWeight: 600, border: '1px solid #c4ff3d', fontFamily: 'inherit' },
  projectCardActive: { background: '#e8f5d9', border: '1px solid #c4ff3d' },
  iconBtn: { width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', borderRadius: 6, color: '#64748b' },
  mainLayout: { display: 'grid', gridTemplateColumns: '300px 1fr', minHeight: 'calc(100vh - 77px)' },
  sidebar: { background: '#fff', borderRight: '1px solid #e2e8f0', padding: '20px 16px' },
  sidebarHeader: { fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8', padding: '0 8px 12px' },
  projectList: { display: 'flex', flexDirection: 'column', gap: 6 },
  projectCard: { padding: '12px 14px', borderRadius: 8, cursor: 'pointer', border: '1px solid transparent' },
  projectCardHeader: { display: 'flex', alignItems: 'flex-start', gap: 8 },
  projectName: { fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  projectClient: { fontSize: 12, color: '#64748b', marginTop: 2 },
  projectMeta: { display: 'flex', gap: 10, fontSize: 12, color: '#64748b', marginTop: 8, flexWrap: 'wrap' },
  main: { padding: '24px 28px', overflowX: 'auto' },
  mainHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 22, flexWrap: 'wrap' },
  projectTitle: { margin: 0, fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', color: '#0d3825' },
  projectTags: { display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' },
  tag: { fontSize: 12, padding: '3px 10px', borderRadius: 999, background: '#f1f5f9', color: '#475569' },
  headerActions: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 10, marginBottom: 24 },
  summaryCard: { padding: '14px 16px', background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0' },
  summaryLabel: { fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' },
  summaryValue: { fontSize: 19, fontWeight: 700, marginTop: 6, letterSpacing: '-0.02em' },
  statusPipeline: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 20 },
  pipelineCard: { padding: '10px 14px', background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0' },
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#475569', margin: '0 0 12px' },
  groupLabel: { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: 10 },
  categoryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 },
  categoryCard: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '12px 14px' },
  categoryHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, gap: 8 },
  categoryDot: { width: 10, height: 10, borderRadius: '50%', flexShrink: 0 },
  categoryName: { fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  categoryCount: { fontSize: 11, padding: '1px 7px', borderRadius: 999, background: '#f1f5f9', color: '#64748b', fontWeight: 600 },
  categoryAmounts: { display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 7, flexWrap: 'wrap' },
  spentAmount: { fontSize: 16, fontWeight: 700 },
  budgetAmount: { fontSize: 12, color: '#94a3b8' },
  progressTrack: { height: 5, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 999, transition: 'width 0.3s' },
  progressLabel: { fontSize: 11, marginTop: 5, fontWeight: 500 },
  emptyItems: { padding: '48px 24px', textAlign: 'center', background: '#fff', borderRadius: 10, border: '1px dashed #cbd5e1' },
  tableWrap: { background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', overflow: 'hidden' },
  table: { width: '100%', fontSize: 14 },
  th: { textAlign: 'left', padding: '11px 14px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '11px 14px', verticalAlign: 'top' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', textAlign: 'center' },
  emptyIcon: { width: 96, height: 96, borderRadius: 16, background: '#fff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  emptyTitle: { margin: '0 0 8px', fontSize: 22, fontWeight: 700 },
  emptyText: { margin: '0 0 20px', color: '#64748b', maxWidth: 420, lineHeight: 1.5 },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 },
  modal: { background: '#fff', borderRadius: 12, width: '100%', maxHeight: '92vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #e2e8f0' },
  modalTitle: { margin: 0, fontSize: 17, fontWeight: 700 },
  modalBody: { padding: '18px 20px', overflowY: 'auto' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18, paddingTop: 14, borderTop: '1px solid #f1f5f9' },
  formRow: { marginBottom: 12 },
  formRowGroup: { display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' },
  label: { display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' },
  input: { width: '100%', padding: '8px 11px', fontSize: 13, borderRadius: 7, border: '1px solid #cbd5e1', background: '#fff', fontFamily: 'inherit' },
  totalPreview: { marginTop: 12, padding: '10px 14px', background: '#f8fafc', borderRadius: 8, fontSize: 13, color: '#475569', borderLeft: '3px solid #0d3825' },
  budgetRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' },
  sortBtn: { padding: '4px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: 4 },
  sortBtnActive: { padding: '4px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #0d3825', background: '#0d3825', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: 4 },
  cfControls: { display: 'flex', gap: 18, marginBottom: 20, padding: 14, background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', flexWrap: 'wrap' },
  searchBar: { display: 'flex', gap: 10, marginBottom: 12, padding: 10, background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', alignItems: 'center', flexWrap: 'wrap' },
  filterPanel: { padding: 14, marginBottom: 12, background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' },
  catRow: { display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid #f1f5f9' },
  colorInput: { width: 40, height: 36, padding: 2, border: '1px solid #cbd5e1', borderRadius: 6, background: '#fff', cursor: 'pointer' },
  statusPill: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', padding: '3px 8px', borderRadius: 999, border: '1px solid', appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer', fontFamily: 'inherit' },
  actionBar: { position: 'sticky', top: 0, zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#0d3825', color: '#fff', borderRadius: 10, marginBottom: 16, gap: 12, flexWrap: 'wrap', boxShadow: '0 4px 12px rgba(13,56,37,0.18)' },
  groupHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', marginBottom: 6 },
  groupMeta: { fontSize: 12, color: '#64748b', fontWeight: 500 },
  dashSplit: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 },
  dashPanel: { background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', overflow: 'hidden' },
  dashPanelHeader: { padding: '14px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  paymentRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', gap: 12 },
  dueDateChip: { padding: '6px 10px', borderRadius: 8, textAlign: 'center', minWidth: 78, flexShrink: 0 },
  dashProjectCard: { padding: 12, borderRadius: 8, border: '1px solid #e2e8f0', cursor: 'pointer', background: '#fff' },
  plBanner: {
    display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px',
    background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 22,
    flexWrap: 'wrap',
  },
  plItem: { flex: 1, minWidth: 160 },
  plLabel: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' },
  plValue: { fontSize: 22, fontWeight: 700, marginTop: 4, letterSpacing: '-0.02em' },
  plSub: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  plDivider: { fontSize: 24, color: '#cbd5e1', fontWeight: 300 },
  planCard: {
    flex: 1, minWidth: 200, padding: '12px 14px', background: '#fff',
    border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer',
    textAlign: 'left', fontFamily: 'inherit',
  },
  planCardActive: {
    flex: 1, minWidth: 200, padding: '12px 14px', background: '#fef3c7',
    border: '2px solid #f59e0b', borderRadius: 8, cursor: 'pointer',
    textAlign: 'left', fontFamily: 'inherit',
  },
  dateSection: {
    background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8,
    padding: '12px 14px', marginBottom: 12,
  },
  dateSectionHeader: {
    display: 'flex', alignItems: 'center', gap: 6,
    fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
    color: '#475569', marginBottom: 10,
  },
  orderCard: {
    background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden',
  },
  orderCardHeader: {
    padding: '14px 16px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc',
    display: 'flex', alignItems: 'center', gap: 12,
  },
  orderNumberBadge: {
    fontSize: 11, padding: '3px 8px', borderRadius: 4,
    background: '#0d3825', color: '#fff', fontWeight: 700, letterSpacing: '0.02em',
    fontFamily: 'monospace',
  },
};
