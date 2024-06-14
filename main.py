import numpy as np
import matplotlib.pyplot as plt
# Génération de la série de Hénon
def henon_map(a, b, x0, y0, n):
    x = np.zeros(n)
    y = np.zeros(n)
    x[0], y[0] = x0, y0
    for i in range(1, n):
        x[i] = 1 - a * x[i-1]**2 + y[i-1]
        y[i] = b * x[i-1]
    return x

# Paramètres du système de Hénon
a = 1.4
b = 0.3
n = 500  # Nombre de points à générer
x0, y0 = 0, 0  # Conditions initiales

# Générer la série
u = henon_map(a, b, x0, y0, n)

# Construire la matrice des séquences x(i) = [u(i), u(i+t), ..., u(i+nt)]
t = 1  # Délais de mesure
n_t = 10  # Nombre de termes dans chaque séquence
m = n - n_t * t  # Nombre de séquences possibles

X = np.zeros((m, n_t + 1))
for i in range(m):
    X[i] = u[i:i + (n_t + 1) * t:t]



print("Matrice de covariance:")
cov_matrix = np.cov(X, rowvar=False)

# Calculer les valeurs propres et les trier par ordre décroissant
eigenvalues = np.linalg.eigvalsh(cov_matrix)
eigenvalues = np.sort(eigenvalues)[::-1]
print(eigenvalues)

# Calculer les erreurs E_l = sqrt(lambda_(l+1))
errors = np.sqrt(eigenvalues[1:])

# Afficher les erreurs sur un graphe
plt.figure(figsize=(10, 6))
plt.plot(errors, 'o-', label='Erreurs $E_l$')
plt.xlabel('Indice $l$')
plt.ylabel('Erreur $E_l$')
plt.title('Erreurs $E_l = \sqrt{\lambda_{l+1}}$')
plt.legend()
plt.grid(True)
plt.show()
