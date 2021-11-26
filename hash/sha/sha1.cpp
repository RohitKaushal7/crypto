#include<bits/stdc++.h>
using namespace std;

uint32_t rotl32(uint32_t x, int r) {
    return (x << r) | (x >> (32 - r));
}

uint32_t rotr32(uint32_t x, int r) {
    return (x >> r) | (x << (32 - r));
}

void sha1Hash(string inp) {
    uint32_t h0 = 0x67452301;
    uint32_t h1 = 0xEFCDAB89;
    uint32_t h2 = 0x98BADCFE;
    uint32_t h3 = 0x10325476;
    uint32_t h4 = 0xC3D2E1F0;

    /*
    ml = message length in bits (always a multiple of the number of bits in a character).

    Pre-processing:
    append the bit '1' to the message e.g. by adding 0x80 if message length is a multiple of 8 bits.
    append 0 ≤ k < 512 bits '0', such that the resulting message length in bits
    is congruent to −64 ≡ 448 (mod 512)
    append ml, the original message length in bits, as a 64-bit big-endian integer. 
    Thus, the total length is a multiple of 512 bits.
    */

   char str [inp.size()+1];
   for(int i=0;i<inp.size(); ++i) str[i] = inp[i];

    uint64_t ml = strlen(str) * 8;
    // cerr << "Message Length : "<< ml << endl;

    int paddingBits = 512 - ((ml % 512) + 64);
    // cerr << "Pading Bits : "<< paddingBits << endl;

    int msgLen = ml/8 + paddingBits/8 + 64/8;
    char * message = new char[msgLen];
    strcpy(message, str);
    int p = paddingBits/8;
    if(p){
        message[ml/8 + 1] = 0x80;
        p--;
        while(p){
            message[ml/8 + 1 + p/8] = 0x00;
            p--;
        }
    }

    for(int i = 0; i < 8; i++){
        message[ml/8 + paddingBits/8 + i] = (ml >> (8*(7-i))) & 0xFF;
    }

    // cerr << "Message : \n";
    for(int i = 0; i < msgLen; i++){
        // cerr << hex << (int) message[i] << " ";
    }

    // Process the message in successive 512-bit chunks:
    // break message into 512-bit chunks
    int chunkSize = 512/8;
    int numChunks = msgLen/chunkSize;
    // cerr << endl << "Number of Chunks : " << numChunks << endl;
    for (int chunk = 0; chunk < numChunks; chunk++) {
        // break chunk into sixteen 32-bit big-endian words w[i], 0 ≤ i ≤ 15
        uint32_t w[80];
        for (int i = 0; i < 16; i++) {
            w[i] = 0;
            for (int j = 0; j < 4; j++) {
                w[i] |= message[chunk*chunkSize + i*4 + j] << (24 - 8*j);
            }
        }

        // Extend the sixteen 32-bit words into eighty 32-bit words:
        for (int i = 16; i < 80; i++) {
            w[i] = rotl32(w[i-3] ^ w[i-8] ^ w[i-14] ^ w[i-16], 1);
        }

        // cerr << "Chunk " << chunk << " : \n";
        for(int i = 0; i < 80; i++){
            // cerr << hex << w[i] << " ";
        }

        // Initialize hash value for this chunk:
        uint32_t a = h0;
        uint32_t b = h1;
        uint32_t c = h2;
        uint32_t d = h3;
        uint32_t e = h4;

        // Main loop:
        for (int i = 0; i < 80; i++) {
            uint32_t f;
            uint32_t k;

            if (i < 20) {
                f = (b & c) | ((~b) & d);
                k = 0x5A827999;
            } else if (i < 40) {
                f = b ^ c ^ d;
                k = 0x6ED9EBA1;
            } else if (i < 60) {
                f = (b & c) | (b & d) | (c & d);
                k = 0x8F1BBCDC;
            } else {
                f = b ^ c ^ d;
                k = 0xCA62C1D6;
            }

            uint32_t temp = rotl32(a, 5) + f + e + k + w[i];
            e = d;
            d = c;
            c = rotl32(b, 30);
            b = a;
            a = temp;
        }

        // Add this chunk's hash to result so far:
        h0 += a;
        h1 += b;
        h2 += c;
        h3 += d;
        h4 += e;
    
    }

    // cerr << endl << "Final Hash : \n";
    cout << hex << h0 << " " << h1 << " " << h2 << " " << h3 << " " << h4 << endl;
    
    char * hash = new char[20];
    for(int i = 0; i < 20; i++){
        hash[i] = (h0 >> (24 - 8*i)) & 0xFF;
    }

}

int main(int argc, char const *argv[])
{
    string inp;
    getline(cin,inp);
    if(!inp.size()) inp = "Rohit Kaushal";
    sha1Hash(inp);
    return 0;
}
